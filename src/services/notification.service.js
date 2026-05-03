import NotificationModel from "../models/notification.model.js";
import { checkExist } from "../utils/index.js";
import { badRequestError } from "../core/error.response.js";
import notificationModel from "../models/notification.model.js";
class notificationService {
  static async pushNotiToSystem({
    type = "SHOP-001",
    receiverId = 1,
    senderId,
    productId,
    options = {},
  }) {
    let noti_content;
    if (type === "SHOP-001") {
      noti_content = `@@@ vua moi them mot san pham: @@@@`;
    } else if (type === "PROMOTION-001") {
      noti_content = `@@@ vua them moi mot voucher: @@@@`;
    }
    // Save the notification to the database
    const newNotification = await notificationModel.create({
      notification_type: type,
      notification_senderId: senderId,
      notification_receiverId: receiverId,
      notification_content: noti_content,
      notification_options: options,
    });
    return newNotification;
  }
  static async getListNotiByUser({ userId = 1, type = "ALL", isRead = 0, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    const match = { notification_receiverId: userId
    };
    if (type !== "ALL") {
      match.notification_type = type;
    }
    const notifications = await notificationModel
      .find(match)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return notifications;
  }
}
export default notificationService;
