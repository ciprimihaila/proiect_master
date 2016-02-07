/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.android.gms.drive.sample.quickstart;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.IntentSender;
import android.content.IntentSender.SendIntentException;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.drive.CreateFileActivityBuilder;
import com.google.android.gms.drive.Drive;
import com.google.android.gms.drive.DriveApi;
import com.google.android.gms.drive.DriveApi.DriveContentsResult;
import com.google.android.gms.drive.DriveFile;
import com.google.android.gms.drive.DriveFolder;
import com.google.android.gms.drive.DriveId;
import com.google.android.gms.drive.DriveResource;
import com.google.android.gms.drive.Metadata;
import com.google.android.gms.drive.MetadataChangeSet;
import com.google.android.gms.drive.query.Filters;
import com.google.android.gms.drive.query.Query;
import com.google.android.gms.drive.query.SearchableField;

/**
 * Android Drive Quickstart activity. This activity takes a photo and saves it
 * in Google Drive. The user is prompted with a pre-made dialog which allows
 * them to choose the file location.
 */
public class UploadActivity extends Activity implements ConnectionCallbacks,
        OnConnectionFailedListener {

    private static final String TAG = "drive-quickstart";
    private static final int REQUEST_CODE_CAPTURE_IMAGE = 1;
    private static final int REQUEST_CODE_CREATOR = 2;
    private static final int REQUEST_CODE_RESOLUTION = 3;
    private static final int REQUEST_CODE_FINISH = 4;
    private static final int REQUEST_CODE_CYCLE = 5;

    private GoogleApiClient mGoogleApiClient;
    private Bitmap mBitmapToSave;

    private DriveId folderID;
    private boolean mFileSaved;
    private boolean mFileSynced;
    private DriveId mDriveID;
    private DriveFile mFile;
    private String altLink;

    ProgressDialog progress;

    /**
     * Create a shared folder on drive
     */

    private void createSharedFolder(String folderName, Bundle connectionHint) {
        if (folderName == null) {
            folderName = new String("Constatare");
        }
        Query query = new Query.Builder()
                .addFilter(Filters.eq(SearchableField.TITLE, folderName))
                .build();
        Drive.DriveApi.getRootFolder(mGoogleApiClient)
                .queryChildren(mGoogleApiClient, query)
                .setResultCallback(childrenRetrievedCallback);

    }


    ResultCallback<DriveApi.MetadataBufferResult> childrenRetrievedCallback = new
            ResultCallback<DriveApi.MetadataBufferResult>() {
                @Override
                public void onResult(DriveApi.MetadataBufferResult result) {
                    if (!result.getStatus().isSuccess()) {
                        Log.i(TAG, "Problem while retrieving files");
                        return;
                    }
                    Log.i(TAG, "Successfully listed folders.");
                    folderID = result.getMetadataBuffer().get(0).getDriveId();
//                    mResultsAdapter.clear();
//                    mResultsAdapter.append(result.getMetadataBuffer());

                }
            };


    final ResultCallback<DriveFolder.DriveFolderResult> folderCreatedCallback = new
            ResultCallback<DriveFolder.DriveFolderResult>() {
                @Override
                public void onResult(DriveFolder.DriveFolderResult result) {
                    if (!result.getStatus().isSuccess()) {
                        Log.i(TAG, "Error while trying to create the folder");
                        return;
                    }
                    //folderID = result.getDriveFolder().getDriveId();
                    Log.i(TAG, "Created a folder: " + result.getDriveFolder().getDriveId());
                }
            };

    /**
     * Create a new file and save it to Drive.
     */
    private void saveFileToDrive() {
        // Start by creating a new contents, and setting a callback.
        Log.i(TAG, "Creating new contents.");
        final Bitmap image = mBitmapToSave;
        Drive.DriveApi.newDriveContents(mGoogleApiClient)
                .setResultCallback(new ResultCallback<DriveContentsResult>() {

                    @Override
                    public void onResult(DriveContentsResult result) {
                        // If the operation was not successful, we cannot do anything
                        // and must
                        // fail.
                        if (!result.getStatus().isSuccess()) {
                            Log.i(TAG, "Failed to create new contents.");
                            return;
                        }
                        // Otherwise, we can write our data to the new contents.
                        Log.i(TAG, "New contents created.");
                        // Get an output stream for the contents.
                        OutputStream outputStream = result.getDriveContents().getOutputStream();
                        // Write the bitmap data from it.
                        ByteArrayOutputStream bitmapStream = new ByteArrayOutputStream();
                        image.compress(Bitmap.CompressFormat.PNG, 100, bitmapStream);
                        try {
                            outputStream.write(bitmapStream.toByteArray());
                        } catch (IOException e1) {
                            Log.i(TAG, "Unable to write file contents.");
                        }
                        // Create the initial metadata - MIME type and title.
                        // Note that the user will be able to change the title later.
                        DriveFolder folder = Drive.DriveApi.getFolder(mGoogleApiClient, folderID);
                        MetadataChangeSet metadataChangeSet = new MetadataChangeSet.Builder()
                                .setMimeType("image/jpeg").setTitle("PozaConstatare.png").build();
                        // Create an intent for the file chooser, and start it.
                        IntentSender intentSender = Drive.DriveApi
                                .newCreateFileActivityBuilder()
                                .setInitialMetadata(metadataChangeSet)
                                .setInitialDriveContents(result.getDriveContents())
                                .setActivityStartFolder(folderID)
                                .build(mGoogleApiClient);

                        try {
                            startIntentSenderForResult(
                                    intentSender, REQUEST_CODE_CREATOR, null, 0, 0, 0);
                        } catch (SendIntentException e) {
                            Log.i(TAG, "Failed to launch file chooser.");
                        }
                    }
                });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mGoogleApiClient == null) {
            // Create the API client and bind it to an instance variable.
            // We use this instance as the callback for connection and connection
            // failures.
            // Since no account name is passed, the user is prompted to choose.
            mGoogleApiClient = new GoogleApiClient.Builder(this)
                    .addApi(Drive.API)
                    .addScope(Drive.SCOPE_FILE)
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .build();
        }
        // Connect the client. Once connected, the camera is launched.
        mGoogleApiClient.connect();
    }

    @Override
    protected void onPause() {
        if (mGoogleApiClient != null) {

            Log.i(TAG, "Disconnecting api client for some reason");
            mGoogleApiClient.disconnect();
        }
        super.onPause();
    }

    @Override
    protected void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        switch (requestCode) {
            case REQUEST_CODE_CAPTURE_IMAGE:
                // Called after a photo has been taken.
                if (resultCode == Activity.RESULT_OK) {
                    // Store the image data as a bitmap for writing later.
                    mBitmapToSave = (Bitmap) data.getExtras().get("data");
                }
                break;
            case REQUEST_CODE_CREATOR:
                // Called after a file is saved to Drive.
                if (resultCode == RESULT_OK) {
                    Log.i(TAG, "Image successfully saved.");

                    mDriveID = (DriveId) data.getParcelableExtra(CreateFileActivityBuilder.EXTRA_RESPONSE_DRIVE_ID);
                    Log.i(TAG, "Selected folder's ID: " + mDriveID.encodeToString());
                    Log.i(TAG, "Selected folder's Resource ID: " + mDriveID.getResourceId());// this is the id of the actual file

                    //mBitmapToSave = null;
                    mFileSynced = false;
                    mFileSaved = true;
                    finishActivity(REQUEST_CODE_FINISH);
                }
                break;
            case REQUEST_CODE_FINISH:
                finishActivity(REQUEST_CODE_FINISH);
                break;
        }
    }
    ResultCallback<Status> statusResultCallback = new ResultCallback<Status>() {
        @Override
        public void onResult(Status status) {
            Log.i(TAG, "SYNC Fucking finished m8 " + status.getStatusMessage());
            if (status.isSuccess()) {
                mFileSynced = true;
                mFile = mDriveID.asDriveFile();
                mFile.getMetadata(mGoogleApiClient).setResultCallback(metadataRetrievedCallback);
                Log.i(TAG, " wohoo " + mDriveID.getResourceId());
                Toast.makeText(getApplicationContext(), "Image uploaded successfully", Toast.LENGTH_LONG).show();
                mFileSaved = true;
            } else {
                Toast.makeText(getApplicationContext(), "Rate limit exceeded. Please Try again later",
                        Toast.LENGTH_LONG).show();
            }
        }
    };

    ResultCallback<DriveResource.MetadataResult> metadataRetrievedCallback = new
            ResultCallback<DriveResource.MetadataResult>() {
                @Override
                public void onResult(DriveResource.MetadataResult result) {
                    if (!result.getStatus().isSuccess()) {
                        Log.i(TAG, "Problem while trying to fetch metadata");
                        return;
                    }
                    Metadata metadata = result.getMetadata();
                    metadata.getAlternateLink();
                    Log.i(TAG, "Metadata succesfully fetched. Title: " + metadata.getWebContentLink());
                    altLink = metadata.getWebContentLink();
                    progress.dismiss();
                    Intent data = new Intent();

                    data.putExtra("FileID", mDriveID.toInvariantString());
                    data.putExtra("altLink", altLink);
                    if (getParent() == null) {
                        setResult(Activity.RESULT_OK, data);
                    } else {
                        getParent().setResult(Activity.RESULT_OK, data);
                    }
                    mFileSaved = true;
                    mFileSynced = true;

                    finish();
                }
    };
    @Override
    public void onConnectionFailed(ConnectionResult result) {
        // Called whenever the API client fails to connect.
        Log.i(TAG, "GoogleApiClient connection failed: " + result.toString());
        if (!result.hasResolution()) {
            // show the localized error dialog.
            GoogleApiAvailability.getInstance().getErrorDialog(this, result.getErrorCode(), 0).show();
            return;
        }
        // The failure has a resolution. Resolve it.
        // Called typically when the app is not yet authorized, and an
        // authorization
        // dialog is displayed to the user.
        try {
            result.startResolutionForResult(this, REQUEST_CODE_RESOLUTION);
        } catch (SendIntentException e) {
            Log.e(TAG, "Exception while starting resolution activity", e);
        }
    }

    @Override
    public void onConnected(Bundle connectionHint) {
        Log.i(TAG, "API client connected.");

        createSharedFolder(null, connectionHint);

        if (mBitmapToSave == null) {
            mFileSaved = false;
        	// This activity has no UI of its own. Just start the camera.
            startActivityForResult(new Intent(MediaStore.ACTION_IMAGE_CAPTURE),
                    REQUEST_CODE_CAPTURE_IMAGE);
            return;
        }
        if (mFileSaved) {

            if (mFileSynced){
                Log.i(TAG, "Finished photo upload :" + mDriveID.toInvariantString());
            } else {
                Log.i(TAG, "Finished photo saving");

                new android.os.Handler().postDelayed(
                        new Runnable() {
                            public void run() {
                                Log.i(TAG, "This'll run 2000 milliseconds later");
                                Drive.DriveApi.requestSync(mGoogleApiClient).setResultCallback(statusResultCallback);
                            }
                        },
                        2000);



                progress = ProgressDialog.show(this, "Waiting",
                        "Waiting for storage confirmation", true);

            }

        } else {
            saveFileToDrive();
        }
    }

    @Override
    public void onConnectionSuspended(int cause) {
        Log.i(TAG, "GoogleApiClient connection suspended");
    }
}
