<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const { user, signin, error, loading } = useAuth();
const emit = defineEmits(["success"]);

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  signin(payload.data.email, payload.data.password);
}

watch(user, (newUser) => {
  if (newUser) {
    emit("success");
  }
});
</script>

<template>
  <UAuthForm
    v-if="!loading"
    class="p-8"
    :schema="schema"
    title="Sign in"
    description="Only available for selected users."
    icon="fa7-solid:user"
    :fields="fields"
    @submit="onSubmit"
  >
    <template v-if="error" #validation>
      <UAlert
        color="error"
        variant="subtle"
        icon="i-lucide-info"
        :title="error"
      />
    </template>
  </UAuthForm>
  <div v-else>Signin you in</div>
</template>
