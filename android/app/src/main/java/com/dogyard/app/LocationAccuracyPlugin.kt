package com.dogyard.app

import android.app.Activity
import android.content.Intent
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.gms.common.api.ResolvableApiException
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationSettingsRequest
import com.google.android.gms.location.LocationSettingsStatusCodes
import com.google.android.gms.location.Priority

@CapacitorPlugin(name = "LocationAccuracy")
class LocationAccuracyPlugin : Plugin() {
  companion object {
    private const val REQUEST_CHECK_SETTINGS = 21991
  }

  @PluginMethod
  fun showLocationAccuracyDialog(call: PluginCall) {
    val activity = activity ?: run {
      call.reject("Activity not available")
      return
    }

    val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10_000L)
      .setMinUpdateIntervalMillis(5_000L)
      .setWaitForAccurateLocation(true)
      .build()

    val settingsRequest = LocationSettingsRequest.Builder()
      .addLocationRequest(locationRequest)
      .setAlwaysShow(true)
      .build()

    val settingsClient = LocationServices.getSettingsClient(activity)
    settingsClient.checkLocationSettings(settingsRequest)
      .addOnSuccessListener {
        val result = JSObject()
        result.put("enabled", true)
        call.resolve(result)
      }
      .addOnFailureListener { ex ->
        if (ex is ResolvableApiException) {
          try {
            saveCall(call)
            ex.startResolutionForResult(activity, REQUEST_CHECK_SETTINGS)
          } catch (sendEx: Exception) {
            call.reject("Failed to open location resolution dialog", sendEx)
          }
          return@addOnFailureListener
        }

        val result = JSObject()
        result.put("enabled", false)
        result.put("resolvable", false)
        if ((ex as? com.google.android.gms.common.api.ApiException)?.statusCode == LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE) {
          result.put("reason", "settings_change_unavailable")
        }
        call.resolve(result)
      }
  }

  @PluginMethod
  fun openGoogleLocationSettings(call: PluginCall) {
    val activity = activity ?: run {
      call.reject("Activity not available")
      return
    }

    try {
      val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
      activity.startActivity(intent)

      val result = JSObject()
      result.put("opened", true)
      call.resolve(result)
    } catch (ex: Exception) {
      call.reject("Failed to open location settings", ex)
    }
  }

  override fun handleOnActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.handleOnActivityResult(requestCode, resultCode, data)

    if (requestCode != REQUEST_CHECK_SETTINGS) {
      return
    }

    val savedCall = getSavedCall() ?: return
    freeSavedCall()

    val result = JSObject()
    if (resultCode == Activity.RESULT_OK) {
      result.put("enabled", true)
      savedCall.resolve(result)
      return
    }

    result.put("enabled", false)
    result.put("cancelled", true)
    savedCall.resolve(result)
  }
}


