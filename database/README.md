# SafariMap GameWarden Database Setup

This directory contains the SQL scripts needed to set up your Supabase database for the SafariMap GameWarden application.

## 🚀 Quick Setup

### 1. Run the Main Schema
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "Run" to execute the script

### 2. Set Up Storage
1. In the SQL Editor, copy and paste the contents of `storage-setup.sql`
2. Click "Run" to create storage buckets and policies

### 3. Add Sample Data (Optional)
1. In the SQL Editor, copy and paste the contents of `sample-data.sql`
2. Click "Run" to populate your database with test data

## 📋 What Gets Created

### Tables
- **profiles** - User profiles extending Supabase auth
- **parks** - Park information
- **incidents** - Incident reports
- **locations** - Wildlife and POI locations
- **location_photos** - Photos for locations
- **reports** - Detailed incident reports
- **achievements** - User achievements
- **user_achievements** - User-achievement relationships

### Storage Buckets
- **location-photos** - For location images (5MB limit)
- **incident-photos** - For incident images/videos (10MB limit)

### Security
- Row Level Security (RLS) enabled on all tables
- Policies allowing users to:
  - View all public data
  - Create/update/delete their own records
  - Upload photos to their locations/incidents

## 🔧 Configuration

### Environment Variables
Make sure your `.env` file contains:
```env
EXPO_PUBLIC_SUPABASE_URL=https://ukwhaovrofmbcynkiemc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### App Configuration
Update `config/appConfig.ts`:
```typescript
export const AppConfig = {
  USE_MOCK_DATA: false,
  USE_SUPABASE: true,
  // ... other config
};
```

## 🧪 Testing

### Create Test Users
1. Go to Authentication > Users in your Supabase dashboard
2. Create a new user with email/password
3. The user profile will be automatically created via the trigger

### Test Data
The sample data includes:
- 3 sample incidents
- 6 sample locations (wildlife, hotels, dining, viewpoints)
- 3 sample reports
- 5 sample photos
- 4 achievements with user assignments

## 🔍 Verification

After running the scripts, verify:
1. All tables are created in the Table Editor
2. Storage buckets exist in Storage
3. RLS policies are active
4. Sample data is visible (if you ran sample-data.sql)

## 🚨 Troubleshooting

### Common Issues

**"relation does not exist"**
- Make sure you ran `schema.sql` first
- Check that all tables were created successfully

**"permission denied"**
- Verify RLS policies are correctly set up
- Check that users are authenticated

**Storage upload fails**
- Ensure storage buckets are created
- Verify storage policies allow uploads
- Check file size limits (5MB for photos, 10MB for videos)

### Reset Database
If you need to start over:
1. Drop all tables in reverse order
2. Re-run the schema.sql script
3. Re-run storage-setup.sql
4. Re-run sample-data.sql

## 📚 Next Steps

After database setup:
1. Update your app configuration
2. Implement Supabase authentication
3. Migrate data services to use Supabase
4. Test real-time features
5. Set up photo upload functionality

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
