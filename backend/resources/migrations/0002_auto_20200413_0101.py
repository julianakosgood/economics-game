# Generated by Django 2.2.7 on 2020-04-13 06:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game_management', '0001_initial'),
        ('resources', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='currency_balance',
            field=models.FloatField(default=0.0),
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField(default=0.0)),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('round_number', models.IntegerField(default=0)),
                ('game_instance', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='game_management.GameInstance')),
            ],
        ),
        migrations.CreateModel(
            name='PlayerPurchase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_owned', models.IntegerField(default=1)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='resources.Stock')),
            ],
        ),
    ]
