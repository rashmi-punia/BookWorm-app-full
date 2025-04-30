import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../assets/styles/profile.styles";
import { Image } from "expo-image";
import { useAuthStore } from "../store/authStore";
import { formatMemberSince } from "../lib/utils";

const ProfileHeader = () => {
  const { user } = useAuthStore();
  const [joinDate, setJoinDate] = useState("");

  useEffect(() => {
   setJoinDate( formatMemberSince(user.createdAt));
  }, []);

  console.log("joined date:", joinDate);
  

  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>Joined {joinDate}</Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
