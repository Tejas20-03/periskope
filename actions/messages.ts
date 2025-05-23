"use server";

import { createClient } from "@/utils/supabase/server";
import { Message } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function getMessages(
  currentUserId: string,
  otherUserId: string
): Promise<{
  messages: Message[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender.eq.${currentUserId},receiver.eq.${otherUserId}),and(sender.eq.${otherUserId},receiver.eq.${currentUserId})`
      )
      .order("timestamp", { ascending: true });

    if (error) {
      return { messages: null, error: error.message };
    }

    // Convert timestamp strings to Date objects
    const formattedMessages = data.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    })) as Message[];

    return { messages: formattedMessages, error: null };
  } catch (error) {
    return {
      messages: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch messages",
    };
  }
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  text: string
): Promise<{
  message: Message | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const messageId = uuidv4();
    const timestamp = new Date().toISOString();

    const newMessage = {
      id: messageId,
      sender: senderId,
      receiver: receiverId,
      text,
      timestamp: timestamp,
      read: false,
    };

    const { data, error } = await supabase
      .from("messages")
      .insert(newMessage)
      .select()
      .single();

    if (error) {
      console.error("Database error when sending message:", error);
      return { message: null, error: error.message };
    }

    // Convert timestamp string to Date object
    const formattedMessage = {
      ...data,
      timestamp: new Date(data.timestamp),
    } as Message;

    return { message: formattedMessage, error: null };
  } catch (error) {
    console.error("Exception when sending message:", error);
    return {
      message: null,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

export async function markMessagesAsRead(
  currentUserId: string,
  otherUserId: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender", otherUserId)
      .eq("receiver", currentUserId)
      .eq("read", false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark messages as read",
    };
  }
}
