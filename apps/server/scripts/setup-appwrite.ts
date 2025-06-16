import * as dotenv from "dotenv";
import { Client, Databases, ID, Permission, Role } from "node-appwrite";

// Load environment variables
dotenv.config({ path: "../.dev.vars" });

const client = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
	.setProject(process.env.APPWRITE_PROJECT_ID!)
	.setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "chat-database";

async function setupDatabase() {
	try {
		console.log("🚀 Setting up Appwrite database and collections...");

		// Create database
		try {
			await databases.create(DATABASE_ID, "Chat Database");
			console.log("✅ Database created successfully");
		} catch (error: any) {
			if (error.code === 409) {
				console.log("ℹ️  Database already exists");
			} else {
				throw error;
			}
		}

		// Create Users collection
		try {
			await databases.createCollection(
				DATABASE_ID,
				"users",
				"Users",
				[Permission.read(Role.any()), Permission.write(Role.any())],
				false, // documentSecurity
				true, // enabled
			);
			console.log("✅ Users collection created");

			// Add attributes to Users collection
			await databases.createStringAttribute(
				DATABASE_ID,
				"users",
				"name",
				255,
				true,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"users",
				"email",
				255,
				true,
			);
			await databases.createBooleanAttribute(
				DATABASE_ID,
				"users",
				"emailVerification",
				false,
				false,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"users",
				"image",
				2000,
				false,
			);

			// Create indexes
			await databases.createIndex(DATABASE_ID, "users", "email_idx", "key", [
				"email",
			]);

			console.log("✅ Users collection attributes created");
		} catch (error: any) {
			if (error.code === 409) {
				console.log("ℹ️  Users collection already exists");
			} else {
				throw error;
			}
		}

		// Create Conversations collection
		try {
			await databases.createCollection(
				DATABASE_ID,
				"conversations",
				"Conversations",
				[Permission.read(Role.any()), Permission.write(Role.any())],
				false,
				true,
			);
			console.log("✅ Conversations collection created");

			// Add attributes
			await databases.createStringAttribute(
				DATABASE_ID,
				"conversations",
				"name",
				255,
				false,
			);
			await databases.createBooleanAttribute(
				DATABASE_ID,
				"conversations",
				"isGroup",
				true,
				false,
			);
			await databases.createDatetimeAttribute(
				DATABASE_ID,
				"conversations",
				"lastMessageAt",
				false,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"conversations",
				"userIds",
				50,
				true,
				undefined,
				true,
			); // array
			await databases.createStringAttribute(
				DATABASE_ID,
				"conversations",
				"messageIds",
				50,
				false,
				undefined,
				true,
			); // array

			// Create indexes
			await databases.createIndex(
				DATABASE_ID,
				"conversations",
				"userIds_idx",
				"key",
				["userIds"],
			);
			await databases.createIndex(
				DATABASE_ID,
				"conversations",
				"lastMessageAt_idx",
				"key",
				["lastMessageAt"],
				["DESC"],
			);

			console.log("✅ Conversations collection attributes created");
		} catch (error: any) {
			if (error.code === 409) {
				console.log("ℹ️  Conversations collection already exists");
			} else {
				throw error;
			}
		}

		// Create Messages collection
		try {
			await databases.createCollection(
				DATABASE_ID,
				"messages",
				"Messages",
				[Permission.read(Role.any()), Permission.write(Role.any())],
				false,
				true,
			);
			console.log("✅ Messages collection created");

			// Add attributes
			await databases.createStringAttribute(
				DATABASE_ID,
				"messages",
				"body",
				5000,
				false,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"messages",
				"image",
				2000,
				false,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"messages",
				"conversationId",
				50,
				true,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"messages",
				"senderId",
				50,
				true,
			);
			await databases.createStringAttribute(
				DATABASE_ID,
				"messages",
				"seenIds",
				50,
				false,
				undefined,
				true,
			); // array

			// Create indexes
			await databases.createIndex(
				DATABASE_ID,
				"messages",
				"conversationId_idx",
				"key",
				["conversationId"],
			);
			await databases.createIndex(
				DATABASE_ID,
				"messages",
				"senderId_idx",
				"key",
				["senderId"],
			);
			await databases.createIndex(
				DATABASE_ID,
				"messages",
				"createdAt_idx",
				"key",
				["$createdAt"],
				["ASC"],
			);

			console.log("✅ Messages collection attributes created");
		} catch (error: any) {
			if (error.code === 409) {
				console.log("ℹ️  Messages collection already exists");
			} else {
				throw error;
			}
		}

		console.log("🎉 Appwrite setup completed successfully!");
		console.log("");
		console.log("Next steps:");
		console.log(
			"1. Update your .dev.vars file with the correct Appwrite credentials",
		);
		console.log("2. Install dependencies: bun install");
		console.log("3. Start the development server: bun run dev");
		console.log("");
		console.log("Database ID:", DATABASE_ID);
		console.log("Collections created: users, conversations, messages");
	} catch (error) {
		console.error("❌ Error setting up Appwrite:", error);
		process.exit(1);
	}
}

setupDatabase();
