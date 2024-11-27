
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { ref, onBeforeUnmount, onMounted } from "vue";


export const useLanguageStore = defineStore("language", () => {
  const { locale, tm } = useI18n();

  let wordsArray = tm("typed.words");;
  let interval;
  let currentIndex = ref(0);

  const startUpdatingWords = () => {
    interval = setInterval(updateWord, 2000);
  };

  const stopUpdatingWords = () => {
    clearInterval(interval);
  };

  const toggleLanguage = () => {
    if (locale.value === "es") {
      // Cambiar idioma y actualizar wordsArray
      locale.value = "en";
      wordsArray = tm("typed.words");


    } else {
      // Cambiar idioma y actualizar wordsArray
      locale.value = "es";
      wordsArray = tm("typed.words");

    }
    currentIndex.value = 0;
  };
  let currentWord = ref("");
  const updateWord = () => {
    if (wordsArray.length > 0) {
      currentWord.value = wordsArray[currentIndex.value];
      currentIndex.value = (currentIndex.value + 1) % wordsArray.length;
    }
  };

  onMounted(() => {
    startUpdatingWords();
    updateWord();
  });

  onBeforeUnmount(() => {
    stopUpdatingWords();
  });


  return {
    startUpdatingWords,
    stopUpdatingWords,
    toggleLanguage,
    currentWord,
  };
});
