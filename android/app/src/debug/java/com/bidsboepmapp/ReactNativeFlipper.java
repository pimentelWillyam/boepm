/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * <p>This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */
package com.bidsboepmapp;

import android.content.Context;

import com.facebook.flipper.android.AndroidFlipperClient;
import com.facebook.flipper.core.FlipperClient;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
// import com.facebook.react.modules.network.FlipperOkhttpInterceptor;
import com.facebook.react.modules.network.NetworkingModule;

import java.lang.reflect.Field;

public class ReactNativeFlipper {
  public static NetworkFlipperPlugin networkFlipperPlugin = null;

  // public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
  //   if (FlipperUtils.shouldEnableFlipper(context)) {
  //     final FlipperClient client = AndroidFlipperClient.getInstance(context);

  //     client.addPlugin(new InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()));

  //     // Network plugin (opcional)
  //     networkFlipperPlugin = new NetworkFlipperPlugin();
  //     client.addPlugin(networkFlipperPlugin);

  //     client.start();

  //     // Adiciona interceptor ao NetworkingModule
  //     ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
  //     if (reactContext != null) {
  //       NetworkingModule networkingModule = reactContext.getNativeModule(NetworkingModule.class);
  //       if (networkingModule != null) {
  //         networkingModule.addInterceptor(new FlipperOkhttpInterceptor(networkFlipperPlugin));
  //       }
  //     }
  //   }
  // }
}
