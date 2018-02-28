				// TEST LVMH - à Adrien Eudes. Stage Data Engineer - Adrien Pourtier adrienpourtier@me.com
				
				// Charger Fast-Csv : npm install fast-csv
				
				// Je peux auto créer des objets suivant des
				// nouveaux pays mais par simplification
				Australia = {
					country : "Australia",
					quantity : 0.0,
					numberOfCountry : 0.0
				};
				USA = {
					country : "USA",
					quantity : 0.0,
					numberOfCountry : 0.0
				};
				UK = {
					country : "UK",
					quantity : 0.0,
					numberOfCountry : 0
				};
				France = {
					country : "France",
					quantity : 0.0,
					numberOfCountry : 0
				};
				China = {
					country : "China",
					quantity : 0.0,
					numberOfCountry : 0
				};

				numberRequestOk = 0; // 100 valid requests 
				var http = require("http");
				url = "http://localhost:3000";
				
				function doRequest(numberRequestOk) {
					var request = http.get(url, function(response) {

						// console.log(response.statusCode );
						if (response.statusCode == 404) {
							console.log("Error 404");
							//setTimeout(doRequest, 1000,numberRequestOk);
						} else {
							
							var body = '';

							response.on("data", function(chunk) {
								body += chunk;
							});

							response.on("end", function() {
								var data = JSON.parse(body);

								data
										.forEach(function(data) {

											switch (data.country) {
											case "Australia":
												Australia.quantity += data.value;
												Australia.numberOfCountry++;
												break;
											case "UK":
												UK.quantity += data.value;
												UK.numberOfCountry++;
												break;
											case "France":
												France.quantity += data.value;
												France.numberOfCountry++;
												break;
											case "China":
												China.quantity += data.value;
												China.numberOfCountry++;
												break;
											case "USA":
												USA.quantity += data.value;
												USA.numberOfCountry++;
												break;
											default:
												console.log(data.country
														+ " is missing as Object");
											}
										});
								/*console.log(JSON.stringify(Australia));
								console.log(JSON.stringify(UK));
								console.log(JSON.stringify(France));
								console.log(JSON.stringify(China));
								console.log(JSON.stringify(USA));*/
								
								var debut = new Date();
								var month = ("0" + (debut.getMonth() + 1)).slice(-2);
								var day = ("0" + debut.getDate()).slice(-2);

								var fs = require('fs');
								var csv = require('fast-csv');

								var ws = fs.createWriteStream('response_' + debut.getFullYear() + month + day
										+ '.csv');

								csv
										.write(//could be one value in each cell, no very clear [ Australia.country ][ Australia.quantity/Australia.numberOfCountry ]
												[["country, avg_score"],
														[ Australia.country + ',' + Australia.quantity/Australia.numberOfCountry ],
														[ France.country + ',' + France.quantity / France.numberOfCountry ],
														[ UK.country + ',' + UK.quantity / UK.numberOfCountry ],
														[ China.country + ',' + China.quantity/ China.numberOfCountry ],
														[ USA.country + ',' + USA.quantity/ USA.numberOfCountry ] ], {
													headers : true
												}).pipe(ws);

							});
						};
					});
				}
				
				try{
					while (numberRequestOk < 100) {
						setTimeout(doRequest, 1500,numberRequestOk);
					numberRequestOk++;

					}
					} catch (err){
						console.log("Error happens")
					}
				
				