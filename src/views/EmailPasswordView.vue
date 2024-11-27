<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="height: 80vh;">
      <div class="col-md-6">
        <div class="card shadow bg-body-tertiary rounded p-5">
          <h3>{{
            $t('titles.resetPassword') }}</h3>
          <form  @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">{{
                $t('profile.email')
              }}</label>
              <input type="email" v-model="email" class="form-control" id="email" :placeholder="$t('login.email')
                  ">
            </div>
            <div class="row">
              <div class="col-md-12 d-flex justify-content-center">
                <button type="submit" class="btn btn-custom">{{ $t('buttons.send') }} <i
                    class="ri-send-plane-fill"></i></button>
              </div>
            </div>
          </form>
          
          <div class="text-center pt-3">
            <router-link class="link-dark link-offset-2" to="/"> {{ $t('login.title') }}</router-link><br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const email = ref('');

 // Inicialmente mostrar el primer formulario

const handleSubmit = async () => {
  try {
    //console.log(email.value);
  await authStore.mail(email.value,);
  } catch (error) {
    // console.log(error);
    
  }
     

 
};

</script>

<style lang="scss" scoped>
.btn-custom {
  background-color: var(--blue-color);
  color: #ffffff;
  padding: 1rem 4rem;
  font-size: 1.25rem;
}

.btn-custom:hover {
  background-color: var(----color-background);
  color: var(--blue-color);
  border: 2px solid var(--blue-color);
}
</style>
