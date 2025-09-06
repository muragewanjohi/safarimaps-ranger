# 🧪 Test Driven Development (TDD) Guide for SafariMap GameWarden

## 📚 **What is TDD?**

**Test Driven Development** is a software development approach where you write tests **before** writing the actual code. The cycle follows the **Red-Green-Refactor** pattern:

1. **🔴 Red**: Write a failing test
2. **🟢 Green**: Write minimal code to make the test pass
3. **🔄 Refactor**: Clean up the code while keeping tests green

## 🎯 **Why TDD for SafariMap?**

- **Bug Prevention**: Catch issues early in development
- **Code Quality**: Forces better design and architecture
- **Documentation**: Tests serve as living documentation
- **Confidence**: Safe to refactor and add features
- **Team Collaboration**: Clear expectations for functionality

## 🏗️ **Testing Architecture**

### **Test Structure**
```
__tests__/
├── services/           # Service layer tests
├── components/         # React component tests
├── hooks/             # Custom hook tests
├── utils/             # Utility function tests
└── integration/       # End-to-end tests
```

### **Test Naming Convention**
```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Test implementation
    });
  });
});
```

## 🧪 **Writing Your First TDD Test**

### **Step 1: Write the Test First (Red)**
```typescript
describe('AuthService', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = ['test@example.com', 'user@domain.co.uk'];
      
      validEmails.forEach(email => {
        expect(authService.validateEmail(email)).toBe(true);
      });
    });
  });
});
```

### **Step 2: Run Test (Should Fail)**
```bash
npm test
# Test will fail because validateEmail doesn't exist yet
```

### **Step 3: Write Minimal Code (Green)**
```typescript
export class AuthService {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

### **Step 4: Run Test Again (Should Pass)**
```bash
npm test
# Test should now pass
```

### **Step 5: Refactor (Keep Green)**
```typescript
export class AuthService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  validateEmail(email: string): boolean {
    return AuthService.EMAIL_REGEX.test(email);
  }
}
```

## 📋 **TDD Best Practices**

### **1. Test Structure (AAA Pattern)**
```typescript
it('should validate correct email formats', () => {
  // Arrange
  const validEmails = ['test@example.com', 'user@domain.co.uk'];
  const authService = new AuthService();
  
  // Act
  const results = validEmails.map(email => authService.validateEmail(email));
  
  // Assert
  results.forEach(result => expect(result).toBe(true));
});
```

### **2. Test Isolation**
```typescript
beforeEach(() => {
  // Reset state before each test
  jest.clearAllMocks();
  authService = new AuthService();
});
```

### **3. Descriptive Test Names**
```typescript
// ❌ Bad
it('should work', () => {});

// ✅ Good
it('should return true when email format is valid', () => {});

// ✅ Better
it('should validate standard email formats like user@domain.com', () => {});
```

### **4. Test One Thing at a Time**
```typescript
// ❌ Bad - Testing multiple behaviors
it('should validate email and password', () => {
  expect(authService.validateEmail('test@example.com')).toBe(true);
  expect(authService.validatePassword('password123')).toBe(true);
});

// ✅ Good - Testing one behavior
it('should validate correct email formats', () => {
  expect(authService.validateEmail('test@example.com')).toBe(true);
});

it('should validate correct password formats', () => {
  expect(authService.validatePassword('password123')).toBe(true);
});
```

## 🎭 **Mocking Strategies**

### **1. Mock External Dependencies**
```typescript
// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));
```

### **2. Mock Functions**
```typescript
const mockSignIn = jest.fn().mockResolvedValue({
  data: { user: mockUser, session: mockSession },
  error: null,
});

mockSupabase.auth.signInWithPassword = mockSignIn;
```

### **3. Mock Async Operations**
```typescript
// Mock API delay
jest.spyOn(global, 'setTimeout').mockImplementation((cb) => {
  cb();
  return 1 as any;
});
```

## 📊 **Test Coverage Goals**

### **Minimum Coverage Requirements**
- **Services**: 90%+
- **Components**: 80%+
- **Hooks**: 85%+
- **Utils**: 95%+
- **Overall**: 85%+

### **Coverage Commands**
```bash
# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests in CI mode
npm run test:ci
```

## 🚀 **TDD Workflow for New Features**

### **1. Feature Planning**
```typescript
// Write test cases first
describe('UserProfileService', () => {
  describe('updateProfile', () => {
    it('should update user profile successfully', () => {});
    it('should validate required fields', () => {});
    it('should handle validation errors', () => {});
    it('should update timestamp on successful update', () => {});
  });
});
```

### **2. Implementation**
```typescript
// Write minimal code to make tests pass
export class UserProfileService {
  async updateProfile(userId: string, updates: ProfileUpdates): Promise<Result> {
    // Implementation here
  }
}
```

### **3. Edge Cases**
```typescript
// Add tests for edge cases
it('should handle network timeouts gracefully', () => {});
it('should retry failed requests up to 3 times', () => {});
it('should log errors for debugging', () => {});
```

## 🔍 **Common TDD Patterns**

### **1. Parameterized Tests**
```typescript
describe('validateRangerId', () => {
  const validIds = ['ABC-123', 'XYZ-789', 'RGR-001'];
  const invalidIds = ['ABC123', 'ABC-12', 'AB-123'];

  it.each(validIds)('should accept valid ranger ID: %s', (rangerId) => {
    expect(authService.validateRangerId(rangerId)).toBe(true);
  });

  it.each(invalidIds)('should reject invalid ranger ID: %s', (rangerId) => {
    expect(authService.validateRangerId(rangerId)).toBe(false);
  });
});
```

### **2. Test Data Factories**
```typescript
const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Wildlife Ranger',
  ...overrides,
});

it('should handle user with custom role', () => {
  const user = createMockUser({ role: 'Senior Ranger' });
  expect(user.role).toBe('Senior Ranger');
});
```

### **3. Async Testing**
```typescript
it('should handle async operations correctly', async () => {
  // Arrange
  const mockUser = createMockUser();
  mockAuthService.login.mockResolvedValue({ success: true, user: mockUser });

  // Act
  const result = await authService.login(credentials);

  // Assert
  expect(result.success).toBe(true);
  expect(result.user).toEqual(mockUser);
});
```

## 🚨 **Troubleshooting Common Issues**

### **1. Test Environment Issues**
```bash
# Clear Jest cache
npx jest --clearCache

# Run with verbose output
npx jest --verbose

# Run specific test file
npx jest authService.test.ts
```

### **2. Mock Issues**
```typescript
// Ensure mocks are properly typed
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

### **3. Async Test Issues**
```typescript
// Use proper async/await
it('should handle async operations', async () => {
  const result = await service.asyncMethod();
  expect(result).toBeDefined();
});

// Or use done callback for complex async
it('should handle complex async', (done) => {
  service.complexAsyncMethod().then(result => {
    expect(result).toBeDefined();
    done();
  });
});
```

## 📈 **Next Steps**

1. **Fix Current Test Issues**: Address the failing tests in AuthService
2. **Expand Test Coverage**: Add tests for all services and components
3. **Integration Tests**: Test complete user workflows
4. **Performance Tests**: Test app performance under load
5. **E2E Tests**: Test complete user journeys

## 🎯 **Success Metrics**

- **Test Coverage**: >85%
- **Test Execution Time**: <30 seconds
- **Test Reliability**: 99%+ pass rate
- **Code Quality**: Reduced bug reports
- **Development Speed**: Faster feature delivery

---

**Remember**: TDD is a skill that improves with practice. Start small, be patient, and focus on writing clear, maintainable tests that drive better code design.
