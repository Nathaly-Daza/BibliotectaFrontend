<template>
  <div class="container-fluid   ">
    <div class="label switch btn-color-mode-switch text-start">
      <input class="text-start" :value="locale === 'es' ? 'es' : 'en'" id="language_switch" name="language_switch"
        type="checkbox" :checked="locale === 'es'" @change="toggleLanguage" />
      <label class="label btn-color-mode-switch-inner text-start" data-off="Es" data-on="En"
        for="language_switch">.</label>
    </div>
  </div>
</template>
<script setup>

import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const toggleLanguage = () => {
  locale.value = locale.value === "es" ? "en" : "es";
};


</script>
<style lang="scss" scoped>
label {
  color: #e1e4e6;
}

.btn-color-mode-switch {
  display: inline-block;
  margin: 0px;
  margin-left: -8px;
  position: relative;
  background-color: #e1e4e6;
  border-radius: 22px;
  border: 2px solid #919494;
}

.btn-color-mode-switch>.label.btn-color-mode-switch-inner {
  margin: 0px;
  width: 80px;
  height: 40px;
  background-color: var(--background--button--color);
  background-size: cover;
  border-radius: 26px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  /*box-shadow: 0px 0px 8px 0px rgba(17, 17, 17, 0.34) inset;*/
  display: block;
}

.btn-color-mode-switch>.label.btn-color-mode-switch-inner:before {
  content: attr(data-on);
  position: absolute;
  font-size: 16px;
  font-weight: 600;
  top: 10px;
  right: 15px;
  color: #222;

}

.btn-color-mode-switch>.label.btn-color-mode-switch-inner:after {
  content: "";
  width: 30px;
  height: 30px;
  background-image: url(../assets/flagIconEEUU.webp);
  background-size: cover;
  border-radius: 26px;
  position: absolute;
  font-size: 20px;
  display: flex;
  justify-content: center;
  left: 5px;
  top: 5px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 6px -2px #111;
  padding: 5px 0px;
  color: #222;
  font-weight: 600;
}

.btn-color-mode-switch input[type="checkbox"] {
  cursor: pointer;
  width: 50px;
  height: 25px;
  opacity: 0;
  position: absolute;
  top: 0;
  z-index: 1;
  margin: 0px;
}

.btn-color-mode-switch input[type="checkbox"]:checked+.label.btn-color-mode-switch-inner {
  background-color: var(--background--button--color)
}

.btn-color-mode-switch input[type="checkbox"]:checked+.label.btn-color-mode-switch-inner:after {
  content: "";
  left: 45px;
  background-image: url(../assets/flagIconColombia.webp);
  background-size: cover;
}

.btn-color-mode-switch input[type="checkbox"]:checked+.label.btn-color-mode-switch-inner:before {
  content: attr(data-off);
  right: auto;
  left: 20px;

}
</style>
