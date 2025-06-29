import { v4 as uuidv4 } from 'uuid'; // Assuming UUID library is available

class ClipboardNotificationManager {
    constructor() {
        this.notifications = [];
        this.notificationLimit = 10; // Example limit
        this.iconUrl = 'icon.png'; // Consider making this dynamic
    }

    // Method to create a notification
    createNotification(clipboardContent) {
        const notification = {
            id: uuidv4(), // Use UUID for unique notification ID
            content: clipboardContent,
            timestamp: new Date().toISOString()
        };

        this.notifications.push(notification);
        this.checkNotificationLimit();
        this.showNotification(notification);
    }

    // Method to display a notification to the user
    showNotification(notification) {
        chrome.notifications.create(notification.id, {
            type: 'basic',
            iconUrl: this.iconUrl,
            title: 'Clipboard Content Synced',
            message: notification.content,
            priority: 2
        }, function(notificationId) {
            console.log('Notification displayed:', notificationId);
        });
    }

    // Method to check notification limit
    checkNotificationLimit() {
        if (this.notifications.length > this.notificationLimit) {
            this.notifications.shift(); // Remove oldest notification
        }
    }

    // Method to clear all notifications
    clearNotifications() {
        this.notifications = [];
        chrome.notifications.getAll((notifications) => {
            for (const notificationId in notifications) {
                chrome.notifications.clear(notificationId);
            }
        });
    }

    // Method to retrieve notifications for display
    getNotifications() {
        return [...this.notifications]; // Return a copy to prevent external modification
    }
}

// Exporting the ClipboardNotificationManager for use in other modules
const clipboardNotificationManager = new ClipboardNotificationManager();
export default clipboardNotificationManager;