package com.google.android.gms.drive.sample.quickstart;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TimePicker;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MainActivity extends Activity {

    List<String> carModels = Arrays.asList( "Alfa Romeo",
            "Aston Martin",
            "Audi",
            "Bentley",
            "Benz",
            "BMW",
            "Bugatti",
            "Cadillac",
            "Chevrolet",
            "Chrysler",
            "Citroen",
            "Corvette",
            "DAF",
            "Dacia",
            "Daewoo",
            "Daihatsu",
            "Datsun",
            "De Lorean",
            "Dino",
            "Dodge",
            "Farboud",
            "Ferrari",
            "Fiat",
            "Ford",
            "Honda",
            "Hummer",
            "Hyundai",
            "Jaguar",
            "Jeep",
            "KIA ",
            "Koenigseg",
            "Lada",
            "Lamborghini",
            "Lancia",
            "Land Rover",
            "Lexus",
            "Ligier",
            "Lincoln",
            "Lotus",
            "Martini",
            "Maserati",
            "Maybach",
            "Mazda",
            "McLaren",
            "Mercedes",
            "Mercedes-Benz",
            "Mini",
            "Mitsubishi",
            "Nissan",
            "Noble",
            "Opel",
            "Peugeot",
            "Pontiac",
            "Porsche",
            "Renault",
            "Rolls-Royce",
            "Rover",
            "Saab",
            "Seat",
            "Skoda",
            "Smart",
            "Spyker",
            "Subaru",
            "Suzuki",
            "Toyota",
            "Vauxhal",
            "Volkswagen",
            "Volvo");

    EditText textPolita, textNrInmatriculare,
             textCNP, textModel, textLocalitate,
             textDescriere;
    TimePicker textOra;
    DatePicker textData;
    Spinner textMarca;
    String urlPhoto = new String(" ");
    String username;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            username = extras.getString("username");
        } else {
            username = new String("ciprian");
        }

        textMarca = (Spinner) findViewById(R.id.car_spinner);

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(
                this, android.R.layout.simple_spinner_item, carModels);

        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        textMarca.setAdapter(adapter);

        textPolita = (EditText) findViewById(R.id.editNrPolita);
        textNrInmatriculare = (EditText) findViewById(R.id.editNrInmatriculare);
        textCNP = (EditText) findViewById(R.id.editCNP);
        textModel = (EditText) findViewById(R.id.editModel);
        textLocalitate = (EditText) findViewById(R.id.editLocalitate);
        textDescriere = (EditText) findViewById(R.id.editDescriere);

        textOra = (TimePicker) findViewById(R.id.timePicker);
        textData = (DatePicker) findViewById(R.id.datePicker);

        Button upload_button= (Button) findViewById(R.id.upload_button);
        upload_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               Intent intent = new Intent(MainActivity.this, UploadActivity.class);
               startActivityForResult(intent, 1);
            }
        });
    }

    public void sendClaim(View v){

        RequestQueue queue = Volley.newRequestQueue(this);

        String url ="https://proiect-master-eugen01.c9users.io/dauna";

        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Display the first 500 characters of the response string.
                        Toast.makeText(getApplicationContext(),"Response is: " + response, Toast.LENGTH_LONG)
                                .show();
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i("drive-quickstart", error.getMessage());
                Toast.makeText(getApplicationContext(),"Fail", Toast.LENGTH_LONG)
                        .show();
            }
        }){
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();

                if (textMarca == null || textMarca.getSelectedItem().toString() == null){
                    Log.i("drive-quickstart","Weird");
                    return params;
                }

                params.put("marca",textMarca.getSelectedItem().toString());
                params.put("polita",textPolita.getText().toString());
                params.put("inmatriculare",textNrInmatriculare.getText().toString());
                params.put("cnp",textCNP.getText().toString());
                params.put("model",textModel.getText().toString());
                params.put("location",textLocalitate.getText().toString());
                params.put("description",textDescriere.getText().toString());
                params.put("username",username);
                params.put("date",textData.getYear()+"-"
                        +textData.getMonth()+"-"
                        +textData.getDayOfMonth()+"T22:00:00.000Z");
                params.put("time","1970-01-01T"+textOra.getCurrentHour()+":"
                        +textOra.getCurrentMinute()+":00.000Z");
                params.put("urlimagine",urlPhoto);
                return params;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String,String> params = new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }

        };
// Add the request to the RequestQueue.
        queue.add(stringRequest);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == RESULT_OK) {
            Log.i("drive-quickstart", "GOT PHOTO MAN");
            Log.i("drive-quickstart", data.getStringExtra("altLink"));
            urlPhoto = data.getStringExtra("altLink");
        }
    }
}
