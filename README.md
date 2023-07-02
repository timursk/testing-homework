# Домашнее задание: Автотесты
## Как запустить
```sh
# установите зависимости
npm ci

# соберите клиентский код приложения
npm run build

# запустите сервер
npm start
```
После этого можете открыть приложение в браузере по адресу http://localhost:3000/hw/store

## Как проверять
```sh
# проверка unit и e2e тестов без багов
npm run test

# проверка unit и e2e тестов c багом (после "--bug=" число от 0 до 10. Пишите если работает некорректно на MacOS/Linux. На Windows работает)
npm run checkAll --bug=5

# отдельная проверка unit тестов c багом (после "--bug=" число от 0 до 10)
npm run check:unit --bug=9

# отдельная проверка e2e тестов c багом (после "--bug=" число от 0 до 10)
npm run check:e2e --bug=2

```
