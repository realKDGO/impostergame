# Median configuration for BLENDIN

## Offline support

The production build includes a service worker that precaches the game interface, local word database, hint explanations, styles, and images. Players must open the app online once and allow the first load to finish. Later launches can work without a connection.

- Android: service workers work in Median WebView without extra setup.
- iOS 14+: add the exact production domain to App-Bound Domains and enable service workers in the iOS project.
- Disable Median's native offline error page if it covers the cached app interface.
- After every deployment, open the app online once so the updated cache can finish installing.
- A first-ever launch still requires internet because the APK loads the hosted site before its cache exists.

Test a production APK by opening it online, closing it, enabling airplane mode, and reopening it. Home, setup, categories, card reveal, voting, results, scores, statistics, and settings should remain available.

The project now creates browser-history entries for every game screen. Android's back button and Median's swipe-back gesture can therefore return to the previous game screen without reloading the application.

Use these Median App Studio settings before rebuilding the APK:

## Interface > Gestures

- Swipe Navigation: ON
- Pull-to-Refresh on Android: OFF
- Pull-to-Refresh on iOS: OFF
- Pinch-to-Zoom: OFF

Pull-to-refresh is a native Median feature. Median requires it to be disabled in App Studio, then included in a new APK build. The website also blocks browser overscroll as a second layer of protection.

## Navigation

- Do not add a native Refresh button to the top navigation bar.
- Avoid Auto New Windows for the BLENDIN domain. Keep internal navigation in the same WebView so the game history remains available.
- If a native navigation bar is enabled, do not configure its Back button to load the home URL directly. Use the WebView history action.

## After changing the settings

1. Deploy the updated website to Vercel.
2. Confirm Median uses the production Vercel URL.
3. Rebuild the Android APK in Median.
4. Uninstall the older test APK or clear its WebView cache before testing the new build.

## Expected behavior

- Android back gesture: returns to the previous BLENDIN screen.
- Pulling down at the top: does not reload the game.
- Pages remain scrollable when their content is taller than the screen.
- Scrollbars are hidden on Android, iOS, and desktop browsers.
- Private card information is hidden whenever navigation occurs.
