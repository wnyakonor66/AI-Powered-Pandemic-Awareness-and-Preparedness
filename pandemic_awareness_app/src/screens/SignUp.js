import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../styles/global";
import FlatButton from "../shared/button";
import { useNavigation } from "@react-navigation/native";

function SignUp() {
  const navigation = useNavigation();
  return (
    <View style={globalStyles.container}>
      <View style={styles.innerContainer}>
        <View style={globalStyles.imageContainer}>
          <Image
            source={require("../../assets/images/purple.jpg")}
            style={globalStyles.image}
          />
        </View>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerText}>Pandemic Guard</Text>
        </View>

        <View style={globalStyles.formArea}>
          <View style={globalStyles.innerForm}>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Username</Text>
              <TextInput
                placeholder="Your username"
                style={globalStyles.input}
              />
            </View>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Email</Text>
              <TextInput placeholder="Your email" style={globalStyles.input} />
            </View>
            <View style={globalStyles.items}>
              <Text style={globalStyles.label}>Password</Text>
              <TextInput placeholder="......" style={globalStyles.input} />
            </View>
          </View>
        </View>
        <FlatButton
          text="Register"
          style={{
            width: "85%",
            marginVertical: 10,
          }}
        />

        <View style={{ flexDirection: "row" }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
            <Text style={{ fontWeight: "bold" }}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignUp;
