const payload = {
  provider_profile:  inputData.communityId,
  first_name: inputData.first,
  last_name: inputData.last,
  email: inputData.emailAddress,
  phone: inputData.phoneNumber
};

const response = await fetch('https://api.talkfurther.com/api/v1/leads/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Api-Key ' + inputData.apiKey
  },
  body: JSON.stringify(payload)
});

const result = await response.json();
if (response.status == 201)
{
	return {success: true}
}

return {success: false} //I am assuming this zap should just return 'success: true' or 'success: false' based on the result
