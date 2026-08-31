# Backend Fix Guide: Provider Organization Name Not Persisting / Missing in Auth Response

## 📌 Context & Problem Summary
When a Provider updates their profile (specifically `organizationName`), the Frontend sends a `PUT` request to `/api/users/:userId`.
- The update request succeeds with `200 OK` (`User updated successfully`).
- However, when the Frontend subsequently calls `GET /api/auth/me` (or `GET /api/users/me/profile`), the backend returns a `user` object where `organizationName` (or `organisationName` / `providerBusinessName`) is **missing/empty/undefined**.
- As a result, the user's organization name resets to empty on refetch.

---

## 🔍 Root Causes in Backend

### 1. Missing `organizationName` in Allowed Update Fields (`PUT /api/users/:id`)
In the controller handling `PUT /api/users/:id` (or `PUT /api/users/profile`), the list of allowed fields to update or destructure from `req.body` might omit `organizationName` / `organisationName` / `providerBusinessName`.

**Example of the issue in backend:**
```javascript
// ❌ WRONG: organizationName is missing from destructured body or allowed fields
const { name, email, phone, bio, postcode } = req.body;
```

### 2. Missing `organizationName` in User Model Schema / Mongoose Schema
If using Mongoose (MongoDB) or SQL/Prisma, the User schema may not have `organizationName` (or `organisationName` / `providerBusinessName`) defined as a schema path, causing Mongoose to silently strip it out on `.save()` or `.findByIdAndUpdate()`.

### 3. Missing `organizationName` in `GET /api/auth/me` Response Serializer / Projection
In the controller handling `GET /api/auth/me`:
- The query might be using `.select('-password')` or explicitly selecting specific fields, but omitting `organizationName` (or `organisationName` / `providerBusinessName`).
- Or the user serializer / DTO function (`sanitizeUser(user)` or `toUserJSON(user)`) only formats:
  ```javascript
  // ❌ WRONG: organizationName is not returned in auth/me payload
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
    // Missing organizationName!
  };
  ```

---

## 🛠️ Required Backend Fixes

### Step 1: Update Mongoose / User Schema
Ensure `organizationName` (and optional aliases) is included in your User model schema:

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'provider', 'coach'], default: 'user' },
  organizationName: { type: String, default: '' },
  organisationName: { type: String, default: '' },
  providerBusinessName: { type: String, default: '' },
  bio: { type: String, default: '' },
  postcode: { type: String, default: '' },
  phone: { type: String, default: '' },
  // ... other fields
});
```

---

### Step 2: Update User Update Controller (`PUT /api/users/:id`)
Ensure `organizationName`, `organisationName`, and `providerBusinessName` are allowed and saved when receiving a update request:

```javascript
// controllers/userController.js
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    fullName,
    organizationName,
    organisationName,
    providerBusinessName,
    bio,
    aboutOrganization,
    postcode,
    postCode,
    postalCode,
    phone,
    sessionType,
    sportsOffered,
    serviceTypes,
  } = req.body;

  const orgNameValue = organizationName || organisationName || providerBusinessName || '';

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(name && { name }),
        ...(fullName && { fullName }),
        organizationName: orgNameValue,
        organisationName: orgNameValue,
        providerBusinessName: orgNameValue,
        bio: bio || aboutOrganization || '',
        postcode: postcode || postCode || postalCode || '',
        phone,
        sessionType,
        sportsOffered,
        serviceTypes,
      },
    },
    { new: true, runValidators: true }
  ).select('-password');

  return res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser,
    },
  });
};
```

---

### Step 3: Update `GET /api/auth/me` Response Payload
Ensure the user object returned by `GET /api/auth/me` includes `organizationName` / `organisationName`:

```javascript
// controllers/authController.js
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        organizationName: user.organizationName || user.organisationName || user.providerBusinessName || '',
        organisationName: user.organizationName || user.organisationName || user.providerBusinessName || '',
        providerBusinessName: user.organizationName || user.organisationName || user.providerBusinessName || '',
        bio: user.bio,
        postcode: user.postcode,
        phone: user.phone,
        avatar: user.avatar,
      },
    },
  });
};
```

---

## ✅ Summary Checklist for Backend Developer
- [ ] Added `organizationName` & `organisationName` to User Schema.
- [ ] Destructured and saved `organizationName` in `PUT /api/users/:id`.
- [ ] Returned `organizationName` in the JSON payload of `GET /api/auth/me`.
