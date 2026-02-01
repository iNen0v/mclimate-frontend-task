# MClimate Frontend Task

React приложение за управление на сгради, активи и устройства.

## Как да стартираш проекта

1. Инсталирай dependencies:
```bash
npm install
```

2. Стартирай development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

Приложението ще се отвори на `http://localhost:3000`

## Структура на проекта

```
src/
├── components/          # React компоненти
│   ├── Sidebar.jsx      # Sidebar с навигация
│   ├── BuildingsView.jsx  # Списък със сгради
│   └── DevicesView.jsx    # Таблици с устройства
├── services/            # API заявки
│   └── api.js          # Фетч на данните
├── utils/              # Помощни функции
│   └── dataTransform.js  # Трансформация на данните
├── App.jsx             # Главен компонент
└── main.jsx            # Entry point
```

## Какво прави приложението

### 1. Sidebar
- Показва сгради и тяхната структура (етажи, пространства, стаи)
- Можеш да разгъваш/свиваш елементите
- Устройствата не се показват в sidebar-а (както е изискано)
- Има визуална йерархия с отстъпи

### 2. Buildings View
- Показва всички сгради в списък
- За всяка сграда показва:
  - Име
  - Адрес
  - Брой етажи
  - Брой апартаменти
  - Брой стаи
  - Брой устройства
  - Онлайн устройства

### 3. Devices View
- Показва всички устройства групирани по тип
- Всяка група е таблица която можеш да разгънеш/свиеш
- Има търсене с debounce
- Колоните показват: име, сериен номер, температура, целева температура, батерия, статус, DevEUI

## Performance оптимизации

Опитах се да оптимизирам за големия dataset (~300k устройства).

### Memoization
- Използвам `React.memo()` за компонентите BuildingCard, DeviceRow и DeviceTable
- Използвам `useMemo()` за скъпите изчисления като:
  - Броене на етажи, пространства, стаи, устройства
  - Извличане и групиране на устройства
  - Филтриране на резултатите от търсенето

### Търсене
- Търсенето е debounced с 300ms забавяне
- Резултатите се кешират с useMemo

### Рендериране
- Компонентите се ре-рендират само когато props-ите им се променят
- Таблиците имат sticky headers за по-добър UX

## Решения които направих

### 1. Без virtualization (засега)
Помислих да използвам `react-window` за много големи списъци, но реших да не го правя засега защото:
- Таблиците са групирани по тип, което естествено ограничава видимите редове
- Браузърът се справя добре с умерено големи таблици
- Може да се добави по-късно ако има проблеми с performance

### 2. Рекурсивна обработка на данни
Направих custom рекурсивни функции за броене. Това е по-гъвкаво от това да изравня цялата структура и позволява бъдещи промени в йерархията.

### 3. Структура на компонентите
Разделих логиката: data fetching, трансформация и представяне. Компонентите са reusable с ясни props.

### 4. Стилове
Използвам отделни CSS файлове за всеки компонент. Лесно е да се мигрира към styled-components или Tailwind ако е нужно.

## Trade-offs

1. **Initial Load Time**: Големият dataset (~300k устройства) отнема време за обработка първоначално. В production бих направил:
   - Server-side filtering/pagination
   - Lazy loading на device данните
   - Web Workers за тежките изчисления

2. **Memory Usage**: Всички устройства се зареждат в паметта. В production бих направил:
   - Pagination
   - Virtual scrolling за големи таблици
   - Progressive data loading

3. **Search Performance**: Търсенето е client-side. По-добър подход би бил:
   - Backend search API
   - Индексирано търсене (Elasticsearch и т.н.)

## Какво бих подобрил с повече време

1. **Backend Integration**
   - Pagination API
   - Filtering endpoints
   - Real-time updates с WebSockets

2. **Допълнителни функционалности**
   - Филтриране на устройства по статус, тип, локация
   - Export функционалност (CSV, PDF)
   - Bulk операции върху устройства
   - Детайлни изгледи за сгради/устройства

3. **Performance**
   - Virtual scrolling за големи таблици (`react-window`)
   - Web Workers за обработка на данни
   - Service Worker за offline поддръжка
   - Code splitting и lazy loading

4. **UX подобрения**
   - Loading skeletons вместо spinner
   - По-добри error съобщения
   - Toast notifications
   - Keyboard navigation
   - Accessibility подобрения (ARIA labels)

5. **Тестване**
   - Unit тестове за utility функциите
   - Component тестове с React Testing Library
   - E2E тестове с Cypress

6. **Code Quality**
   - TypeScript миграция
   - ESLint/Prettier конфигурация

## Бонус: Как бих го направил в production

### Как бих обработил този dataset в production

1. **Server-Side Processing**
   - Преместване на всички тежки изчисления (броене, групиране, филтриране) на backend-а
   - Pre-compute на агрегациите (етажи, устройства, онлайн устройства) и съхранение в база данни
   - Използване на database индекси за бързи заявки
   - Data streaming за много големи отговори

2. **Pagination & Lazy Loading**
   - Никога не зареждам всички 300k+ устройства наведнъж
   - Pagination: зареждам 50-100 устройства на страница
   - Cursor-based pagination вместо offset-based
   - Зареждане на сгради в батчове (например 20-50 наведнъж)

3. **Caching Strategy**
   - Backend: Redis cache за често достъпвани сгради и техните статистики
   - Frontend: Service Worker + IndexedDB за offline достъп
   - Cache invalidation стратегия
   - Stale-while-revalidate pattern

4. **Data Processing**
   - Web Workers за client-side обработка която е неизбежна
   - Progressive loading: показвам сградите първо, зареждам устройства на заявка
   - Background sync за device status updates

5. **Error Handling**
   - Retry logic с exponential backoff
   - Graceful degradation когато има частични данни
   - Queue система за offline действия

### Backend/API промени които бих предложил

1. **RESTful API с Pagination**
   ```
   GET /api/buildings?page=1&limit=50&sort=name
   GET /api/buildings/:id
   GET /api/buildings/:id/devices?page=1&limit=100&type=thermostat
   GET /api/buildings/:id/stats
   ```

2. **Search & Filtering Endpoints**
   ```
   GET /api/devices/search?q=thermostat&buildingId=123&status=online
   GET /api/devices?type=temperature&minBattery=3.0&page=1
   ```

3. **Aggregations API**
   ```
   GET /api/buildings/:id/stats
   Response: {
     floors: 5,
     spaces: 12,
     rooms: 45,
     devices: 1200,
     onlineDevices: 1150,
     devicesByType: { "Thermostat": 800, "Sensor": 400 }
   }
   ```

4. **WebSocket/SSE за Real-Time Updates**
   - Push на device status updates (online/offline, промени в температурата)
   - Real-time building statistics updates
   - Намаляване на polling overhead

### Как бих скалирал UI-то по-нататък

1. **Virtualization**
   - Използване на `react-window` или `react-virtualized` за:
     - Buildings list (ако има > 100 елемента)
     - Device tables (задължително за 10k+ редове на таблица)
   - Рендиране само на видимите елементи + малък buffer
   - Намалява DOM nodes от 300k+ на ~50-100

2. **Code Splitting & Lazy Loading**
   ```javascript
   const DevicesView = lazy(() => import('./components/DevicesView'))
   const BuildingsView = lazy(() => import('./components/BuildingsView'))
   ```
   - Зареждане на views на заявка
   - Разделяне на vendor bundles

3. **State Management**
   - Използване на Zustand или Redux Toolkit за:
     - Кеширане на fetch-нати данни
     - Управление на сложни filter states
   - React Query/SWR за server state management

4. **Progressive Enhancement**
   - Skeleton loaders вместо spinner
   - Optimistic UI updates
   - Prefetch на данни при hover/focus

5. **Performance Monitoring**
   - Performance metrics (Web Vitals)
   - Track на render times за големи списъци
   - Monitor на memory usage

## Browser Support

- Модерни браузъри (Chrome, Firefox, Safari, Edge)
- Използвам ES6+ features
- Няма polyfills (може да се добавят ако е нужна поддръжка за IE11)