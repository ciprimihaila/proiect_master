package com.google.android.gms.drive.sample.quickstart;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.drive.sample.quickstart.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends Activity {

    Button loginButton;
    EditText editUser, editPass;
    ProgressDialog progress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        editUser = (EditText) findViewById(R.id.editUser);
        editPass = (EditText) findViewById(R.id.editPass);


    }

    public void login(View v){

        RequestQueue queue = Volley.newRequestQueue(this);

        progress = ProgressDialog.show(this, "Waiting",
                "Va rugam asteptati pentru login", true);

        String url = String.format("https://proiect-master-eugen01.c9users.io/user?password=%1$s&username=%2$s",
                editPass.getText().toString(),
                editUser.getText().toString());

        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Display the first 500 characters of the response string.
                        Toast.makeText(getApplicationContext(), "Response is: " + response, Toast.LENGTH_LONG)
                                .show();

                        try{

                            JSONObject jsonObj = new JSONObject(response);

                            Log.i("drive-quickstart", jsonObj.getString("status"));

                            if (jsonObj.getString("status").equals("ok")){


                                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                                intent.putExtra("username",editUser.getText().toString());
                                progress.dismiss();
                                startActivityForResult(intent, 1);

                            } else {
                                Toast.makeText(getApplicationContext(), "Username sau parola invalide",
                                        Toast.LENGTH_LONG).show();
                            }

                        } catch (JSONException e) {
                            Log.i("drive-quickstart", e.getMessage());
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("drive-quickstart", error.getMessage());
                Toast.makeText(getApplicationContext(),"Fail", Toast.LENGTH_LONG)
                        .show();
            }
        });
        // Add the request to the RequestQueue.
        queue.add(stringRequest);
    }


}
