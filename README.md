## Lab 5
Романов Никита M33051

## Фичи

Данное расширение помогает при написании гайдов с кодом. Достаточно выделить код, чтобы он вставился
в ваш гайд в форматирвоанном виде

Расширение поддерживает следующие настройки:

* `guideHelper.setBaseFileName`: устанавливает имя файла, в котором пишется гайд.
* `guideHelper.addSnippet`: добавляет форматированный код в гайд. (Если название гайда не задано, необходимо ввести имя файла)

## Горячие клавиши

* `ctrl+alt+b` установка имени файла, в котором пишется гайд.
* `ctrl+alt+m` добавление сниппета.

---

## VScode

Данная среда разработке написана с использованием фреймворка Electron (node.js + Chromium), что практически дает кросслатформенность приложению, поскольку с данным фреймворком приложение может быть скомпилированно под любую ОС.

* Плагины в VS Code изолированы от самого редактора и запускаются в отдельном хост-процессе (extension host process), который представляет собой процесс Node.js с возможностью использования VS Code API (набор API-интерфейсов JavaScript).
* Для плагинов используется ленвиая загрузка
* Плагины обычно разделяют на три вида:
  * Стандартные (не требуют серьезных вычислений, запускаются в хост-процессе)
  * Языковые серверы (Клиентская часть плагина запускается в хост-процессе, а серверная часть создаёт дополнительный процесс, в котором производятся все сложные вычисления. Сюжа относят, например, линтеры)
  * Службы отладки (пишутся в виде отдельной программы и взаимодействуют с VS Code по специальному протоколу CDP (VS Code Debug Protocol))