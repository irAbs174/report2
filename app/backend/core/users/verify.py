from django.contrib.auth.hashers import check_password
from .models import Users, Tokens, user_accounts
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.http import JsonResponse
from django.conf import settings
from core.sec import SMS_API_KEY
from django.views import View
from datetime import datetime
from kavenegar import *
import hashlib
import random
import json

def random_code():
    # the following function creates a random four digit code
    # this function is supposed to be taken care of by the sms provider.
    codes = [random.choice(range(10)) for r in range(4)]
    return "".join(str(c) for c in codes)

def generate_token(phone_number):
    return hashlib.sha256(phone_number.encode()).hexdigest()

class Create(View):


    def post(self, request):
        # post logic
        phone_number = request.POST.get('phone_number')
        if phone_number and len(phone_number) == 11 and phone_number.startswith('09'):  # make usre phone number is sent from client
            is_new_user = False
            query_result = user_accounts.objects.filter(phoneNumber=phone_number).values()
            four_digit_code = random_code()

            if query_result.exists() == 0:
                # phone number not in db : new user
                # new_user created pk = 1 and so on...
                is_new_user = True
                # create user in django built-in users table and activate it
                user = user_accounts(phoneNumber=phone_number, WPOPass=four_digit_code)
                user.is_staff = False
                user.is_superuser = False
                user.save()

            else:
                user_accounts.objects.filter(phoneNumber=phone_number
                                     ).update(WPOPass=four_digit_code)
            try:
                api = KavenegarAPI(f'{SMS_API_KEY}')
                params = {
                    'receptor': phone_number,
                    'template': 'kikpickLogin',
                    'token': four_digit_code,
                    'type': 'sms',
                }   
                response = api.verify_lookup(params)
                print(response)
            except APIException as e: 
                print(e)
            except HTTPException as e: 
                print(e)
            return JsonResponse({'status': 'کد ارسال شد', 'phone_number': phone_number, 'success': True})

        return JsonResponse({'status': 'شماره وارد شده صحیح نیست', 'success': False})


class Verify(View):
    def post(self, request):
        is_verified = False
        phone_number = request.POST.get('phone_number')
        verification_code = request.POST.get('code')

        if verification_code and len(phone_number) == 11 and phone_number.startswith('09'): 
            # handle compare from db to see if code is right
            user_result = user_accounts.objects.filter(phoneNumber=phone_number)

            if user_result.values()[0]['WPOPass'] == verification_code:

                is_verified = True
                token = generate_token(phone_number.join(verification_code))
                token_in_db = Tokens.objects.filter(token=token)
                token_exists = False

                if token_in_db.exists() > 0:
                    token_exists = True
                if not token_exists:
                    new_token = Tokens(token=token, user=phone_number)
                    new_token.save()
                return JsonResponse({'status': token, 'success': True})

            return JsonResponse({'status': 'کد وارد شده صحیح نیست', 'success': False})

        return JsonResponse({'status': 'درخواست نامعتبر', 'success': False})



class Authorize(View):
    def get(self, request):
        # request.META holds the headers and to access a custom
        # header HTTP_ >> followed by custom header, Here I'm
        # checking for TOKEN in the header
        token = request.GET.get('meta')
        if token:
            token_result = Tokens.objects.filter(token=token)
            time_span = datetime.now() - token_result[0].created_at.replace(tzinfo=None)

            if time_span.days > 30:
                return JsonResponse({'status':'کد تایید منقضی شده است', 'success': False})

            if token_result.exists():
                user = user_accounts.objects.get(
                    phoneNumber=token_result[0].user)
                # The following lines are responsible for logging the user in to django 
                login(request, user, backend='user_accounts.backends.CustomBackend')

                return JsonResponse({'status':token_result, 'success': True})

        return JsonResponse({'status':'خطای احراز هویت لطفا دوباره وارد شوید', 'success': False})


from django.contrib.auth import logout

class UnAuthorize(View):
    def get(self, request):
        logout(request)
        return JsonResponse({'status':'خطای احراز هویت لطفا دوباره وارد شوید', 'success': Trie})
        pass