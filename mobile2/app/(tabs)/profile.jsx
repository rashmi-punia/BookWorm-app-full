import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { sleep } from ".";
import Loader from "../../components/Loader";
import { Image } from "expo-image";

const Profile = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // console.log("Fetching from:", `${API_URL}/books/user`);

      const response = await fetch(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Raw response:", response);

      // const rawText = await response.text();
      // console.log("Raw response body:", rawText);

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = JSON.parse(rawText); // Convert to JSON
      setBooks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId);
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Delete Response:", response.status, response.statusText);

      const data = await response.json();
      if (!response.ok) {
        console.log("Error Response:", data);
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      Alert.alert("Error", error.message || "Failed to delete recommendation");
    } finally {
      setDeleteBookId(null);
    }
  };

 

  const confirmDelete = (bookId) => {
    handleDeleteBook(bookId);

    // Alert.alert(
    //   "Delete Recommendations",
    //   "Are you sure you want to delete the recommedation ?",
    //   [
    //     { text: "Cancel", style: "cancel" },
    //     {
    //       text: "Delete",
    //       style: "destructive",
    //       onPress: () => handleDeleteBook(bookId),
    //     },
    //   ]
    // );
  };

  const rednerBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(item.rating)}
        </View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          console.log("Delete button pressed for ID:", item._id);
          confirmDelete(item._id);
        }}
      >
        {deleteBookId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length}books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={rednerBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your Favourite Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Profile;
