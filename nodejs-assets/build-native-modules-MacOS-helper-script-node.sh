#!/bin/bash
      # Helper script for Gradle to call node on macOS in case it is not found
      export PATH=$PATH:/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/florenceatoyebi/Documents/OneStopApp/OneStopApp/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/florenceatoyebi/Documents/OneStopApp/OneStopApp/node_modules/.bin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/florenceatoyebi/.rbenv/shims:/Users/florenceatoyebi/.rbenv/shims:/Users/florenceatoyebi/.rbenv/shims:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/Users/florenceatoyebi/.rbenv/shims:/Users/florenceatoyebi/.rvm/bin
      node $@
    