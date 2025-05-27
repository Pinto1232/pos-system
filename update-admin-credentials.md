# 🔐 Keycloak Admin Credentials Update Guide

## Current Status

- ✅ Keycloak is running on port 8282
- ✅ POS realm (pisval-pos-realm) is configured
- ⚠️ Using temporary admin credentials (security risk)

## Action Required: Create Permanent Admin

### Step 1: Create New Admin User

1. **Access Admin Console**: http://localhost:8282
2. **Navigate**: Users → Add user
3. **User Details**:
   ```
   Username: keycloak-admin (or your preferred name)
   Email: your-admin-email@domain.com
   First Name: [Your Name]
   Last Name: [Your Name]
   User Enabled: ON
   Email Verified: ON
   ```
4. **Save** the user

### Step 2: Set Secure Password

1. **Go to**: Credentials tab
2. **Set Password**:
   - Use a strong password (12+ characters)
   - Include: uppercase, lowercase, numbers, symbols
   - Set **Temporary: OFF**
3. **Save** password

### Step 3: Assign Admin Roles

1. **Role Mappings** tab
2. **Realm Roles**: Assign these roles:
   - `admin` (full administrative access)
   - `create-realm` (realm creation permissions)
3. **Client Roles**: Select "realm-management" and assign:
   - `realm-admin` (realm administration)
   - `manage-users` (user management)
   - `manage-clients` (client management)
   - `manage-realm` (realm management)

### Step 4: Test New Admin

1. **Logout** from current session
2. **Login** with new credentials
3. **Verify access** to:
   - Master realm
   - pisval-pos-realm
   - User management
   - Client management

### Step 5: Security Cleanup

Once new admin is confirmed working:

1. **Remove temporary accounts**:

   - Delete or disable any "admin" users with default passwords
   - Remove any test accounts

2. **Update documentation**:

   - Record new admin credentials securely
   - Update any deployment scripts

3. **Environment variables** (if applicable):
   ```bash
   # Update these if you use environment variables for admin access
   KEYCLOAK_ADMIN=keycloak-admin
   KEYCLOAK_ADMIN_PASSWORD=your-secure-password
   ```

## Security Best Practices

### Password Policy

- **Minimum length**: 12 characters
- **Complexity**: Mixed case, numbers, symbols
- **Rotation**: Change every 90 days
- **Unique**: Don't reuse passwords

### Access Control

- **Principle of least privilege**: Only assign necessary roles
- **Regular review**: Audit admin accounts quarterly
- **Session management**: Set appropriate timeouts

### Monitoring

- **Login events**: Monitor admin login activity
- **Failed attempts**: Set up brute force protection
- **Alerts**: Configure notifications for suspicious activity

## Testing Checklist

- [ ] New admin user created
- [ ] Strong password set (Temporary = OFF)
- [ ] Admin roles assigned correctly
- [ ] Can login with new credentials
- [ ] Can access pisval-pos-realm
- [ ] Can manage users and clients
- [ ] Temporary admin accounts removed
- [ ] Credentials documented securely

## Quick Links

- **Admin Console**: http://localhost:8282
- **Test Page**: http://localhost:3000/test-admin-access.html
- **POS Realm**: http://localhost:8282/realms/pisval-pos-realm
- **Realm Account**: http://localhost:8282/realms/pisval-pos-realm/account

## Emergency Recovery

If you get locked out:

1. Stop Keycloak service
2. Use Keycloak CLI to create admin user:
   ```bash
   cd backend/Keycloack/bin
   ./kc.bat start-dev --http-port=8282
   # Set environment variables before starting:
   set KEYCLOAK_ADMIN=recovery-admin
   set KEYCLOAK_ADMIN_PASSWORD=recovery-password
   ```

## Support

- Use the test page to verify admin access
- Run the cleanup script for guidance: `node cleanup-temp-admin.js`
- Check Keycloak logs if issues occur
