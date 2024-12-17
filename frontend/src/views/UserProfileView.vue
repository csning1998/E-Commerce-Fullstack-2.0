<script setup lang="ts">
import { onMounted, reactive, ref, watch, shallowRef } from "vue";
import { useRouter } from "vue-router";
import request from "@/stores/request";
import store from "@/stores/user";
import {
   countries,
   cities,
   onCountryChange,
   dynamicFieldsFor,
} from "@/lib/addressData";

const router = useRouter();
const isEditing = ref(false);
const isModified = ref(false);

const toggleEditMode = (): void => {
   isEditing.value = !isEditing.value;
   console.log("isEditing.value", isEditing.value);
   if (!isEditing.value) {
      Object.assign(currentUser, originalUser);
   }
};

const date = shallowRef();

const isDatePickerVisible = ref(false);

const toggleDatePicker = () => {
   isDatePickerVisible.value = !isDatePickerVisible;
};

const GENDER_LIST = ["Male", "Female", "Apache", "non-Binary"];

const currentUser = reactive<UserProfileFormData>({
   id: 0,
   userId: "",
   userEmail: "",
   userFamilyName: "",
   userGivenName: "",
   userPhoneNumber: "",
   userIdentity: "",
   userGender: "",
   userBirthday: "",
   userProfilePictureUrl: "",
   userAddress: [
      {
         country: "",
         state: "",
         city: "",
         street: "",
         district: "",
         zipCode: "",
      },
   ],
   userPayments: [
      {
         cardNumber: "",
         cardHolderName: "",
         expirationDate: "",
         cvv: "",
      },
   ],
   userPermission: "",
   userCurrency: "",
   userOAuthToken: null,
   userOAuthProvider: null,
   createdAt: 0,
   updatedAt: 0,
});

console.log("currentUser", currentUser);

const originalUser = reactive<UserProfileFormData>({ ...currentUser });

const saveProfile = async () => {
   try {
      await request.put("/users/current", {
         user: currentUser,
      });
      alert("Profile saved!");
      isModified.value = false;
   } catch (error: any) {
      console.error("Error saving profile:", error);
   }
};

const logout = () => {
   localStorage.removeItem("token");
   store.currentUser = null;

   window.dispatchEvent(new CustomEvent("userLoggedOut"));
   alert("You have been logged out.");
   router.push("/");
   window.location.reload();
};

const addAddress = () => {
   if (currentUser.userAddress && currentUser.userAddress.length < 5) {
      currentUser.userAddress.push({
         country: "",
         state: "",
         city: "",
         district: "",
         street: "",
         zipCode: "",
      });
   } else {
      alert("You can add up to five addresses.");
   }
};

const removeAddress = (index: number) => {
   if (currentUser.userAddress && currentUser.userAddress.length > 1) {
      currentUser.userAddress.splice(index, 1);
   } else {
      alert("You must have at least one address.");
   }
};

const addPaymentMethod = () => {
   if (currentUser.userPayments && currentUser.userPayments.length < 10) {
      currentUser.userPayments.push({
         cardNumber: "",
         cardHolderName: "",
         expirationDate: "",
         cvv: "",
      });
   } else {
      alert("You can add up to ten payment methods.");
   }
};

const removePaymentMethod = (index: number) => {
   if (currentUser.userPayments && currentUser.userPayments.length > 1) {
      currentUser.userPayments.splice(index, 1);
   } else {
      alert("You must have at least one payment method.");
   }
};

async function fetchUserInfo() {
   try {
      const res = await request.get("/users/current");

      Object.assign(currentUser, res.data);
      Object.assign(originalUser, res.data);

      watch(currentUser, function (n) {
         if (n.id != 0) {
            isModified.value = true;
         }
      });
   } catch (err) {
      console.error("Error fetching user info:", err);
   }
}

watch(
   () => currentUser.userAddress,
   (newVal) => {
      if (!newVal) return;
      newVal.forEach((address) => {
         if (address.state && address.city) {
            // @ts-ignore
            const cityObj = cities[address.state]?.find(
               (c: { name: string; zipCode: string }) =>
                  c.name === address.city,
            );
            if (cityObj) {
               address.zipCode = cityObj.zipCode;
            }
         }
      });
   },
   { deep: true },
);

const address = reactive({
   country: "",
   state: "",
   city: "",
   district: "",
   street: "",
   zipCode: "",
});

watch(
   () => address.state,
   (newState, oldState) => {
      if (newState !== oldState) {
         address.city = "";
         address.district = "";
      }
   },
);

// To-fix: Render the page immediately after "Save Profile" is clicked.
onMounted(() => {
   fetchUserInfo();
});
</script>

<template>
   <div class="form-container">
      <v-card class="vuerify-card" max-width="1000">
         <v-form>
            <div class="form-card">
               <h1 class="form-title">User Profile</h1>
               <h2 class="form-title">Basic Info</h2>
               <v-card-text>
                  <v-row align="center" justify="space-between">
                     <v-col cols="12" md="8">
                        <v-text-field
                           disabled
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.userId"
                           label="User ID"
                        ></v-text-field>
                        <v-text-field
                           :clearable="isEditing"
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.userFamilyName"
                           label="First Name"
                        ></v-text-field>
                        <v-text-field
                           :clearable="isEditing"
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.userGivenName"
                           label="Last Name"
                        ></v-text-field>
                     </v-col>

                     <v-col cols="12" md="4" class="d-flex justify-center">
                        <v-img
                           class="profile-picture"
                           :src="
                              currentUser.userProfilePictureUrl ||
                              'https://via.placeholder.com/150'
                           "
                           alt="Profile Picture"
                           max-width="200"
                           max-height="200"
                        ></v-img>
                     </v-col>
                  </v-row>
               </v-card-text>

               <v-card-text>
                  <v-row>
                     <v-col cols="12" v-if="!isEditing">
                        <v-text-field
                           readonly
                           variant="outlined"
                           v-model="currentUser.userGender"
                           label="Gender"
                        ></v-text-field>
                     </v-col>

                     <v-col cols="12" v-else>
                        <v-radio-group
                           v-model="currentUser.userGender"
                           label="Gender"
                        >
                           <v-radio
                              v-for="(g, i) in GENDER_LIST"
                              :key="i"
                              :label="g"
                              :value="g"
                           ></v-radio>
                        </v-radio-group>
                     </v-col>

                     <v-col cols="12">
                        <v-text-field
                           disabled
                           variant="outlined"
                           v-model="currentUser.userPermission"
                           label="Identity"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                        <v-text-field
                           :disabled="isEditing"
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.createdAt"
                           label="Created At"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                        <v-text-field
                           type="date"
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.userBirthday"
                           label="Birth Date"
                        ></v-text-field>
                     </v-col>

                     <!-- To-fix: The date picker isn't shown properly. -->
                     <v-col cols="12">
                        <v-menu
                           v-model="isDatePickerVisible"
                           activator="parent"
                           transition="scale-transition"
                           min-width="290"
                        >
                           <template #activator="{ props }">
                              <v-text-field
                                 :readonly="!isEditing"
                                 v-bind="props"
                                 v-model="date"
                                 variant="outlined"
                                 label="Birth Date"
                                 @click="toggleDatePicker"
                              >
                                 <template #append-inner>
                                    <v-btn icon @click.stop="toggleDatePicker">
                                       <v-icon>mdi-calendar</v-icon>
                                    </v-btn>
                                 </template>
                              </v-text-field>
                           </template>
                           <v-date-picker
                              v-model="date"
                              @update:modelValue="toggleDatePicker"
                           >
                              <template #actions>
                                 <v-btn
                                    color="primary"
                                    @click="toggleDatePicker"
                                 >
                                    OK
                                 </v-btn>
                              </template>
                           </v-date-picker>
                        </v-menu>
                     </v-col>
                  </v-row>
               </v-card-text>
            </div>

            <div class="form-card">
               <h2 class="form-title">Contact Info</h2>
               <v-card-text>
                  <v-row dense>
                     <v-col cols="12">
                        <v-text-field
                           :clearable="isEditing"
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.userPhoneNumber"
                           label="Phone Number"
                        ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                        <v-text-field
                           :clearable="isEditing"
                           :readonly="!isEditing"
                           variant="outlined"
                           v-model="currentUser.userEmail"
                           label="Email"
                        ></v-text-field>
                     </v-col>
                  </v-row>
               </v-card-text>
            </div>

            <div class="form-card">
               <h2 class="form-title">Address</h2>
               <v-card-text>
                  <div
                     v-for="(address, index) in currentUser.userAddress"
                     :key="index"
                     class="mb-4"
                  >
                     <v-row dense>
                        <!-- Country -->
                        <v-col cols="12" md="6">
                           <v-autocomplete
                              :items="countries"
                              v-model="address.country"
                              label="Country"
                              variant="outlined"
                              @update:modelValue="
                                 (val) => onCountryChange(val, address)
                              "
                              autocomplete="off"
                              :disabled="!isEditing"
                           ></v-autocomplete>
                        </v-col>

                        <template
                           v-for="field in dynamicFieldsFor(address)"
                           :key="field.key"
                        >
                           <v-col cols="12" md="6">
                              <v-text-field
                                 v-if="field.type === 'text'"
                                 :label="field.label"
                                 v-model="address[field.key]"
                                 variant="outlined"
                                 clearable
                                 :autocomplete="
                                    field.key === 'street' ? 'on' : 'off'
                                 "
                                 :disabled="!isEditing"
                              ></v-text-field>

                              <v-combobox
                                 v-else-if="field.type === 'select-box'"
                                 :label="field.label"
                                 :items="field.items"
                                 v-model="address[field.key]"
                                 variant="outlined"
                                 clearable
                                 :autocomplete="
                                    field.key === 'street' ? 'on' : 'off'
                                 "
                                 :disabled="!isEditing"
                              ></v-combobox>
                           </v-col>
                        </template>
                     </v-row>
                  </div>
                  <div class="form-button-container" v-if="isEditing">
                     <button
                        v-if="isEditing"
                        class="form-button"
                        @click.prevent="removeAddress(index)"
                     >
                        Remove Address
                     </button>
                     <button class="form-button" @click.prevent="addAddress">
                        Add Address
                     </button>
                  </div>
               </v-card-text>
            </div>

            <div class="form-card">
               <h2 class="form-title">Payment Methods</h2>
               <v-card-text>
                  <div
                     v-for="(payment, index) in currentUser.userPayments"
                     :key="index"
                     class="mb-4"
                  >
                     <v-row dense>
                        <v-col cols="12" md="6">
                           <div v-if="!isEditing">{{ payment.cardNumber }}</div>
                           <v-text-field
                              v-else
                              clearable
                              :readonly="!isEditing"
                              variant="outlined"
                              v-model="payment.cardNumber"
                              hide-details="auto"
                              label="Card Number"
                           ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                           <div v-if="!isEditing">
                              {{ payment.cardHolderName }}
                           </div>
                           <v-text-field
                              v-else
                              clearable
                              :readonly="!isEditing"
                              variant="outlined"
                              v-model="payment.cardHolderName"
                              hide-details="auto"
                              label="Holder Name"
                           ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                           <div v-if="!isEditing">
                              {{ payment.expirationDate }}
                           </div>
                           <v-text-field
                              v-else
                              clearable
                              :readonly="!isEditing"
                              variant="outlined"
                              v-model="payment.expirationDate"
                              hide-details="auto"
                              label="Expiration"
                              type="month"
                           ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                           <div v-if="!isEditing">{{ payment.cvv }}</div>
                           <v-text-field
                              v-else
                              clearable
                              :readonly="!isEditing"
                              variant="outlined"
                              v-model="payment.cvv"
                              hide-details="auto"
                              label="CVV"
                              type="text"
                           ></v-text-field>
                        </v-col>
                     </v-row>
                  </div>
                  <div class="form-button-container" v-if="isEditing">
                     <button
                        class="form-button"
                        @click.prevent="removePaymentMethod(index)"
                     >
                        Remove
                     </button>
                     <button
                        class="form-button"
                        @click.prevent="addPaymentMethod"
                     >
                        Add Payment Method
                     </button>
                  </div>
               </v-card-text>

               <!-- Buttons -->
               <v-card-actions>
                  <div class="form-button-container d-flex flex-row mt-2">
                     <button
                        class="form-button"
                        @click.prevent="toggleEditMode"
                     >
                        {{ isEditing ? "Cancel" : "Edit" }}
                     </button>
                     <button
                        class="form-button"
                        v-if="isEditing"
                        :disabled="!isModified"
                        @click.prevent="saveProfile"
                     >
                        Save Profile
                     </button>
                     <button class="form-button" @click.prevent="logout">
                        Logout
                     </button>
                  </div>
               </v-card-actions>
            </div>
         </v-form>
      </v-card>
   </div>
</template>

<style scoped>
.form-title {
   text-align: center;
}

.form-container {
   width: 48rem;
}

h1,
h2 {
   color: var(--color-heading); /* Use theme color */
}

.profile-picture {
   border-radius: 100%;
   border: 1px solid var(--vt-c-divider-dark-2);
   margin-left: 1rem;
   margin-bottom: 1rem;
}
</style>
