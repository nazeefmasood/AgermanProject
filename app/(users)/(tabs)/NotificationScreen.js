import { useUser } from "@clerk/clerk-expo";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import DB from "../../../database/firebaseConfig";
import { Bell, X, RefreshCcw, AlertCircle, Clock } from "lucide-react-native";

const NotificationScreen = ({ isVisible, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const user_id = user.id;
  const [error, setError] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: slideAnim }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, { dx }) => {
        if (dx > 100) {
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: false,
          }).start(onClose);
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();

      fetchNotifications();
    } else {
      Animated.spring(slideAnim, {
        toValue: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const notificationsRef = collection(DB, "notifications");
      const notificationQuery = query(
        notificationsRef,
        where("user_info.userId", "==", user_id)
      );

      const querySnapshot = await getDocs(notificationQuery);
      const notificationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Unable to load notifications. Please try again later.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return "💰";
      case "message":
        return "✉️";
      case "alert":
        return "🔔";
      default:
        return "📌";
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const date = timestamp.toDate();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };
  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{getNotificationIcon(item.type)}</Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>{item.message}</Text>
          <View style={styles.timeContainer}>
            <Clock size={12} color="#666" />
            <Text style={styles.timestamp}>
              {formatTimeAgo(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bell size={20} color="#1a1a1a" />
          <Text style={styles.headerText}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchNotifications}
          >
            <RefreshCcw size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Bell size={40} color="#666" />
          <Text style={styles.noNotifications}>No notifications yet</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 30,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  notificationHeader: {
    flexDirection: "row",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: "#1a1a1a",
    lineHeight: 20,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  unreadDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  noNotifications: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
  },
});

export default NotificationScreen;
