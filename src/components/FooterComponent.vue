<script setup>
</script>

<template>
  <footer class=" text-lg-start w-100 footer ">
    <section class="">
      <div class="container  text-md-start">
        <div class="row ">
          <div class="col-md-2 col-lg-4 col-xl-4 align-content-center">
            <div class="text-uppercase">
              <img alt="Uniempresarial logo" class="logo img-fluid d-inline-block" src="../assets/LogoSinFondo.png"
                width="400" height="150" />
            </div>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-4 mx-auto mt-3 ps-5">
            <h2 class="text-uppercase fw-bold h2">{{ $t('footer.contact') }}</h2>
            <h3 class="fw-bold mb-0 h3">{{ $t('footer.phoneLabel') }}</h3>
            <p class="p text-reset">{{ $t('footer.phone') }}</p>
          </div>

          <div class="col-md-6 col-lg-5 col-xl-4 mx-auto mt-3 ps-5">
            
            <h3 class="fw-bold mb-0 h3">{{ $t('footer.adressLabel') }}</h3>
            <p class="p text-reset mt-0">{{ $t('footer.adress') }} </p>

            <h3 class="fw-bold mb-0 h3">{{ $t('footer.mailLabel') }}</h3>
            <p class="p">
              <a href="mailto:notificacionesjudiciales@uniempresarial.edu.co"
                class="text-reset">notificacionesjudiciales@uniempresarial.edu.co</a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Copyright -->
    <div class=" Copyright">
      <div class="container text-md-start">
        <div class="row align-items-center">
          <div class="col  ">
            <p class=" fw-bold sub">{{ $t('footer.made') }}</p>
          </div>
          <div class="col">
            <h3 class="h3"><span class="fw-bold sub">{{ $t('footer.fabrica') }}</span></h3>
            <p class="p mb-0">fabricasoluciones@uniempresarial.edu.co</p>
            <p class="p">Ricardo Vargas</p>

          </div>
          <div class="col">
            <h3 class="h3"><span class=" fw-bold sub">{{ $t('footer.lider') }}</span></h3>
            <p class="p">Ing. Kellyn Delgado Jaimes</p>

          </div>
        </div>
      </div>
    </div>
    <!-- Copyright -->
  </footer>
</template>

<style>
.footer {
  /* Establece el pie de página como un elemento flexible */
  background-color: var(--slate--Gray--color);
  display: flex;
  flex-direction: column;

}

.Copyright {
  background-color: var(--dark--slate--gray--color);

}

.img {
  width: 150px;
  height: auto;
}

.p {
  font-size: smaller;
}
.h3{
  font-size: 14px;
}
.h2{
  font-size: 16px;
}
.sub {
  font-size: smaller;
}
</style>
