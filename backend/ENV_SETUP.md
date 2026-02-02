# Environment Variables Setup Guide

## Step 1: Create .env File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Option 1: MongoDB Atlas (Cloud - Recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/worknex?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/worknex

# JWT Secret Key
# IMPORTANT: Change this to a random string in production!
# Generate a random string: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_random_string
```

## Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Free Tier Available)

1. **Sign Up**: Go to https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: 
   - Choose FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Atlas admin"
4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
5. **Get Connection String**:
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `worknex`
   - Add to `.env` file as `MONGODB_URI`

**Example Atlas Connection String:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/worknex?retryWrites=true&w=majority
```

### Option B: Local MongoDB

1. **Install MongoDB**:
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow official installation guide

2. **Start MongoDB Service**:
   - Windows: MongoDB should start automatically as a service
   - Mac/Linux: `mongod` or `brew services start mongodb-community`

3. **Use Local Connection String**:
   ```
   MONGODB_URI=mongodb://localhost:27017/worknex
   ```

## Step 3: Generate JWT Secret

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

Copy the generated string and use it as `JWT_SECRET` in your `.env` file.

## Step 4: Verify Setup

1. Make sure `.env` file is in the `backend` directory
2. Check that `.env` is in `.gitignore` (it should be)
3. Start the server: `npm run dev`
4. You should see: `✅ MongoDB Connected`

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to git
- Use strong, random JWT_SECRET in production
- Don't share your MongoDB credentials
- Use environment-specific values for production vs development

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running (local) or cluster is active (Atlas)
- Verify connection string is correct
- Check network/firewall settings
- Ensure IP is whitelisted (Atlas)

### JWT Secret Issues
- Make sure JWT_SECRET is set
- Use a long random string (at least 32 characters)
- Don't use default/example values in production
