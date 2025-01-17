# Generated by Django 4.2.14 on 2024-11-06 08:43

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('position', models.CharField(blank=True, max_length=100, null=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=255)),
                ('inn', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Income',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contract_date', models.DateField()),
                ('contract_number', models.CharField(max_length=255)),
                ('invoice_date', models.DateField()),
                ('invoice_number', models.CharField(max_length=255)),
                ('unit_of_measure', models.CharField(max_length=255)),
                ('total', models.FloatField()),
                ('is_archive', models.BooleanField(default=True)),
                ('added_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('from_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_company', to='warehouse.company')),
            ],
        ),
        migrations.CreateModel(
            name='Outcome',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contract_date', models.DateField()),
                ('contract_number', models.CharField(max_length=255)),
                ('invoice_date', models.DateField()),
                ('invoice_number', models.CharField(max_length=255)),
                ('unit_of_measure', models.CharField(max_length=255)),
                ('total', models.FloatField()),
                ('is_archive', models.BooleanField(default=False)),
                ('added_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('to_company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_company', to='warehouse.company')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('price', models.FloatField()),
                ('kpi', models.CharField(max_length=255)),
                ('quantity', models.IntegerField(blank=True, default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProductMarking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marking', models.CharField(max_length=255, unique=True)),
                ('income', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='income', to='warehouse.income')),
                ('outcome', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='product_markings', to='warehouse.outcome')),
                ('product', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product', to='warehouse.product')),
            ],
        ),
    ]
