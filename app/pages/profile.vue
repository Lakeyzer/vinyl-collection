<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({ middleware: "auth" });

const { user, profile, changePassword } = useAuth();
const toast = useToast();

const state = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const submitting = ref(false);
const error = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  error.value = null;
  submitting.value = true;

  try {
    await changePassword(event.data.currentPassword, event.data.newPassword);
    toast.add({
      title: "Password updated",
      color: "success",
      icon: "fa7-solid:check",
    });
    state.currentPassword = "";
    state.newPassword = "";
    state.confirmPassword = "";
  } catch (e: any) {
    error.value =
      e.code === "auth/invalid-credential"
        ? "Current password is incorrect"
        : e.message;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <UContainer class="pt-4 flex flex-col gap-8 max-w-md">
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-bold">Profile</h1>
        <div class="flex flex-col gap-1 text-sm">
          <div>
            <span class="text-dimmed">Username:</span>
            {{ profile?.username }}
          </div>
          <div>
            <span class="text-dimmed">Email:</span>
            {{ user?.email }}
          </div>
          <div>
            <span class="text-dimmed">Household:</span>
            {{ profile?.group }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold">Change password</h2>
        <UForm
          :schema="schema"
          :state="state"
          class="flex flex-col gap-4"
          @submit="onSubmit"
        >
          <UFormField label="Current password" name="currentPassword">
            <UInput
              v-model="state.currentPassword"
              type="password"
              class="w-full"
            />
          </UFormField>
          <UFormField label="New password" name="newPassword">
            <UInput
              v-model="state.newPassword"
              type="password"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Confirm new password" name="confirmPassword">
            <UInput
              v-model="state.confirmPassword"
              type="password"
              class="w-full"
            />
          </UFormField>
          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            icon="i-lucide-info"
            :title="error"
          />
          <UButton
            type="submit"
            label="Update password"
            :loading="submitting"
            class="self-start"
          />
        </UForm>
      </div>
    </UContainer>
  </NuxtLayout>
</template>
