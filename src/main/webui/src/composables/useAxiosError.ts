import { AxiosError } from "axios";
import { Notify } from "quasar";

export default function (error: AxiosError) {
  console.error(error);

  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
    // http.ClientRequest в node.js
    console.log(error.request);
  } else {
    // Произошло что-то при настройке запроса, вызвавшее ошибку
    console.log("Error", error.message);
  }
  console.log(error.config);

  Notify.create({
    color: "negative",
    message: error.message,
  });
}
