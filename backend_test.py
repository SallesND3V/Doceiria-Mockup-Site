import requests
import sys
from datetime import datetime
import json

class BakeryAPITester:
    def __init__(self, base_url="https://paula-veiga-doces.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_id = None
        self.created_items = {
            'categories': [],
            'cakes': [],
            'testimonials': []
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"  URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"  ✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"  ❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"  Error: {error_detail}")
                except:
                    print(f"  Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"  ❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        if success:
            print(f"  API Message: {response.get('message', 'No message')}")
        return success

    def test_seed_data(self):
        """Test seed data creation"""
        success, response = self.run_test(
            "Seed Data Creation",
            "POST",
            "seed",
            200
        )
        if success:
            print(f"  Message: {response.get('message', 'No message')}")
        return success

    def test_admin_registration(self):
        """Test admin user registration"""
        timestamp = datetime.now().strftime("%H%M%S")
        admin_data = {
            "email": f"test_admin_{timestamp}@test.com",
            "password": "TestPass123!",
            "name": f"Test Admin {timestamp}"
        }
        
        success, response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.admin_id = admin_data['email']  # Store for later use
            print(f"  ✅ Token received: {self.token[:20]}...")
            print(f"  Admin name: {response.get('name', 'N/A')}")
            return True
        return False

    def test_admin_login(self):
        """Test admin login (using existing account if registration worked)"""
        if not self.admin_id:
            print("  ⚠️ Skipping login test - no admin account available")
            return True
            
        login_data = {
            "email": self.admin_id,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"  ✅ Login successful, token refreshed")
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            auth_required=True
        )
        
        if success:
            print(f"  User: {response.get('name', 'N/A')} ({response.get('email', 'N/A')})")
        return success

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )
        
        if success:
            categories = response if isinstance(response, list) else []
            print(f"  Found {len(categories)} categories")
            if categories:
                print(f"  First category: {categories[0].get('name', 'N/A')}")
        return success

    def test_create_category(self):
        """Test creating a category"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        category_data = {
            "name": "Teste Category",
            "slug": "teste-category"
        }
        
        success, response = self.run_test(
            "Create Category",
            "POST",
            "categories",
            200,
            data=category_data,
            auth_required=True
        )
        
        if success and 'id' in response:
            self.created_items['categories'].append(response['id'])
            print(f"  ✅ Created category: {response.get('name')} (ID: {response['id']})")
        return success

    def test_get_cakes(self):
        """Test getting cakes"""
        success, response = self.run_test(
            "Get Cakes",
            "GET",
            "cakes",
            200
        )
        
        if success:
            cakes = response if isinstance(response, list) else []
            print(f"  Found {len(cakes)} cakes")
            if cakes:
                print(f"  First cake: {cakes[0].get('name', 'N/A')} - R${cakes[0].get('price', 0)}")
        return success

    def test_get_featured_cakes(self):
        """Test getting featured cakes"""
        success, response = self.run_test(
            "Get Featured Cakes",
            "GET",
            "cakes?featured=true",
            200
        )
        
        if success:
            cakes = response if isinstance(response, list) else []
            print(f"  Found {len(cakes)} featured cakes")
        return success

    def test_create_cake(self):
        """Test creating a cake"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        # Use existing category or create one
        if not self.created_items['categories']:
            print("  Creating category first...")
            self.test_create_category()
            
        category_id = self.created_items['categories'][0] if self.created_items['categories'] else "cat-aniversario"
        
        cake_data = {
            "name": "Bolo de Teste",
            "description": "Bolo criado para teste da API",
            "price": 99.99,
            "category_id": category_id,
            "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
            "featured": False
        }
        
        success, response = self.run_test(
            "Create Cake",
            "POST",
            "cakes",
            200,
            data=cake_data,
            auth_required=True
        )
        
        if success and 'id' in response:
            self.created_items['cakes'].append(response['id'])
            print(f"  ✅ Created cake: {response.get('name')} (ID: {response['id']})")
        return success

    def test_get_single_cake(self):
        """Test getting a single cake"""
        if not self.created_items['cakes']:
            print("  ⚠️ Skipping - no cakes created")
            return True
            
        cake_id = self.created_items['cakes'][0]
        success, response = self.run_test(
            "Get Single Cake",
            "GET",
            f"cakes/{cake_id}",
            200
        )
        
        if success:
            print(f"  Cake: {response.get('name', 'N/A')} - R${response.get('price', 0)}")
        return success

    def test_update_cake(self):
        """Test updating a cake"""
        if not self.token or not self.created_items['cakes']:
            print("  ⚠️ Skipping - no auth token or cakes")
            return True
            
        cake_id = self.created_items['cakes'][0]
        update_data = {
            "name": "Bolo de Teste Atualizado",
            "price": 129.99
        }
        
        success, response = self.run_test(
            "Update Cake",
            "PUT",
            f"cakes/{cake_id}",
            200,
            data=update_data,
            auth_required=True
        )
        
        if success:
            print(f"  ✅ Updated cake: {response.get('name')} - R${response.get('price')}")
        return success

    def test_get_testimonials(self):
        """Test getting testimonials"""
        success, response = self.run_test(
            "Get Testimonials",
            "GET",
            "testimonials",
            200
        )
        
        if success:
            testimonials = response if isinstance(response, list) else []
            print(f"  Found {len(testimonials)} testimonials")
            if testimonials:
                print(f"  First testimonial by: {testimonials[0].get('author_name', 'N/A')}")
        return success

    def test_create_testimonial(self):
        """Test creating a testimonial"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        testimonial_data = {
            "author_name": "Cliente de Teste",
            "content": "Bolo maravilhoso! Recomendo a todos. Teste da API.",
            "rating": 5
        }
        
        success, response = self.run_test(
            "Create Testimonial",
            "POST",
            "testimonials",
            200,
            data=testimonial_data,
            auth_required=True
        )
        
        if success and 'id' in response:
            self.created_items['testimonials'].append(response['id'])
            print(f"  ✅ Created testimonial by: {response.get('author_name')}")
        return success

    def test_get_stats(self):
        """Test getting admin stats"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        success, response = self.run_test(
            "Get Admin Stats",
            "GET",
            "stats",
            200,
            auth_required=True
        )
        
        if success:
            print(f"  Stats - Cakes: {response.get('cakes', 0)}, Categories: {response.get('categories', 0)}, Testimonials: {response.get('testimonials', 0)}")
        return success

    def test_image_upload(self):
        """Test image upload endpoint"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        print("  ⚠️ Skipping image upload test - requires file handling")
        return True

    def test_get_settings(self):
        """Test getting site settings (public endpoint)"""
        success, response = self.run_test(
            "Get Site Settings (Public)",
            "GET",
            "settings",
            200
        )
        
        if success:
            print(f"  Hero Image URL: {response.get('hero_image_url', 'Not set')[:50]}...")
            print(f"  Logo URL: {response.get('logo_url', 'Not set')[:50]}...")
            # Instagram token should not be exposed in public endpoint
            has_token = 'instagram_access_token' not in response
            print(f"  Instagram token properly hidden: {has_token}")
        return success

    def test_get_settings_admin(self):
        """Test getting site settings (admin endpoint)"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        success, response = self.run_test(
            "Get Site Settings (Admin)",
            "GET",
            "settings/admin",
            200,
            auth_required=True
        )
        
        if success:
            print(f"  Hero Image URL: {response.get('hero_image_url', 'Not set')[:50]}...")
            print(f"  Logo URL: {response.get('logo_url', 'Not set')[:50]}...")
            print(f"  Instagram User ID: {response.get('instagram_user_id', 'Not set')}")
            print(f"  Instagram Token Set: {'Yes' if response.get('instagram_access_token') else 'No'}")
        return success

    def test_update_settings(self):
        """Test updating site settings"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        settings_data = {
            "hero_image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
            "logo_url": "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400"
        }
        
        success, response = self.run_test(
            "Update Site Settings",
            "PUT",
            "settings",
            200,
            data=settings_data,
            auth_required=True
        )
        
        if success:
            print(f"  ✅ Settings updated successfully")
            print(f"  Hero Image: {response.get('hero_image_url', 'Not set')[:50]}...")
            print(f"  Logo URL: {response.get('logo_url', 'Not set')[:50]}...")
        return success

    def test_instagram_sync_without_config(self):
        """Test Instagram sync endpoint without configuration (should fail)"""
        if not self.token:
            print("  ⚠️ Skipping - no auth token")
            return True
            
        success, response = self.run_test(
            "Instagram Sync (No Config - Should Fail)",
            "POST",
            "instagram/sync",
            400,  # Expecting 400 error
            data={},
            auth_required=True
        )
        
        if success:
            print(f"  ✅ Properly returns error when Instagram not configured")
        return success

    def test_login_with_existing_admin(self):
        """Test login with the pre-created admin account"""
        admin_data = {
            "email": "admin@paulaveiga.com",
            "password": "senha123"
        }
        
        success, response = self.run_test(
            "Login with Pre-created Admin",
            "POST",
            "auth/login",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            # Store this token for admin tests
            old_token = self.token
            self.token = response['access_token']
            print(f"  ✅ Admin login successful")
            print(f"  Admin name: {response.get('name', 'N/A')}")
            
            # Test admin-specific endpoints
            self.test_get_settings_admin()
            self.test_update_settings()
            self.test_instagram_sync_without_config()
            
            # Restore original token
            self.token = old_token
            return True
        return False

    def cleanup_test_data(self):
        """Clean up created test data"""
        if not self.token:
            return
            
        print(f"\n🧹 Cleaning up test data...")
        
        # Delete test cakes
        for cake_id in self.created_items['cakes']:
            try:
                self.run_test(f"Delete Test Cake {cake_id}", "DELETE", f"cakes/{cake_id}", 200, auth_required=True)
            except:
                pass
                
        # Delete test testimonials
        for testimonial_id in self.created_items['testimonials']:
            try:
                self.run_test(f"Delete Test Testimonial {testimonial_id}", "DELETE", f"testimonials/{testimonial_id}", 200, auth_required=True)
            except:
                pass
                
        # Delete test categories
        for category_id in self.created_items['categories']:
            try:
                self.run_test(f"Delete Test Category {category_id}", "DELETE", f"categories/{category_id}", 200, auth_required=True)
            except:
                pass

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Paula Veiga Bakery API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Basic tests
        self.test_root_endpoint()
        self.test_seed_data()
        
        # Auth tests
        self.test_admin_registration()
        self.test_admin_login()
        self.test_get_current_user()
        
        # Category tests
        self.test_get_categories()
        self.test_create_category()
        
        # Cake tests
        self.test_get_cakes()
        self.test_get_featured_cakes()
        self.test_create_cake()
        self.test_get_single_cake()
        self.test_update_cake()
        
        # Testimonial tests
        self.test_get_testimonials()
        self.test_create_testimonial()
        
        # Settings tests
        self.test_get_settings()
        
        # Admin tests
        self.test_get_stats()
        self.test_image_upload()
        
        # Test with pre-created admin account
        self.test_login_with_existing_admin()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            failed = self.tests_run - self.tests_passed
            print(f"❌ {failed} tests failed")
            return 1

def main():
    tester = BakeryAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())