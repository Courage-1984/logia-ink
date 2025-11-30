- Visit `https://plausible.io/login` and sign in (or create a free account).  
- Add `logi-ink.com` as a site. Plausible will give you a tiny script tag—already embedded across every page—so you’re done on the code side.  
- After your site gets traffic, open the Plausible dashboard for that site. You’ll see privacy-friendly analytics (pageviews, referrers, campaign params, goals).  
- Under “Events”, Plausible lists anything we send. Web Vitals now appear as `Web Vital - LCP`, `Web Vital - INP`, etc., with their `value`, `rating`, and `path`; “Page Load Metrics” gathers the DNS/TCP/request numbers. Use filters to slice by page or timeframe.  
- If you’re still staging, run the site locally, visit pages, and fake events with DevTools → Console → `window.plausible?.('Web Vital - LCP',{props:{value:'1800',rating:'good'}});` (only works if Plausible script loads).  
- Plausible stores the data; your Web Vitals reporting piggybacks there, so there’s no separate monitoring UI—just the events table/charts once traffic flows.

