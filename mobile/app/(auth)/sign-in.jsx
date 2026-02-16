import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email.trim(),
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/"); 
      } else if (signInAttempt.status === "needs_second_factor") {
        setShowMFA(true);
      } else {
        Alert.alert("Status", signInAttempt.status);
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code.trim(),
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[authStyles.scrollContent, { paddingBottom: 40 }]} 
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image 
              source={require("../../assets/images/i1.png")} 
              style={authStyles.image} 
              contentFit="contain" 
            />
          </View>

          <Text style={authStyles.title}>{showMFA ? "Verify Code" : "Welcome Back"}</Text>

          <View style={authStyles.formContainer}>
            {!showMFA ? (
              <>
                {/* EMAIL */}
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>

                {/* PASSWORD - FIXED UI */}
                <View style={[authStyles.inputContainer, styles.passwordWrapper]}>
                  <TextInput
                    style={[authStyles.textInput, { flex: 1 }]}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={COLORS.textLight} 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={authStyles.authButton} 
                  onPress={handleSignIn} 
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={authStyles.buttonText}>Sign In</Text>}
                </TouchableOpacity>

                {/* SIGN UP LINK - FIXED POSITION */}
                <TouchableOpacity 
                  style={{ marginTop: 20, alignItems: 'center' }} 
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  <Text style={authStyles.linkText}>
                    Don't have an account? <Text style={authStyles.link}>Sign up</Text>
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={authStyles.inputContainer}>
                  <TextInput
                    style={authStyles.textInput}
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                  />
                </View>
                <TouchableOpacity style={authStyles.authButton} onPress={handleVerifyMFA} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={authStyles.buttonText}>Verify Code</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMFA(false)} style={{ marginTop: 15 }}>
                  <Text style={{ textAlign: 'center', color: COLORS.primary }}>Back to Login</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// Inline fixes for the eye icon
const styles = StyleSheet.create({
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  eyeIcon: {
    paddingHorizontal: 10,
  }
});

export default SignInScreen;