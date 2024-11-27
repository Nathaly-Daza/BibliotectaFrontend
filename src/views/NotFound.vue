<template>
    <header>
        <img alt="404 logo" class="logo" src="@/assets/404.jpg" width="600" height="600" />
    <div>
        <h2>404</h2>
    </div>
    <nav class="found">
        <RouterLink to="/">Not Found</RouterLink>
    </nav>
</header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
h2{
    color: var(--red-color);
    font-size: 150px;
    text-align: center;
}
.found{
    font-size: 20px;
    text-align: center;
}
.logo{
    margin-inline:10% ;
}

</style>