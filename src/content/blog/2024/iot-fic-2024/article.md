---
title: "IOT Fic"
date: 2024-04-16
section: writeups
event: "FIC 2024"
---

Pour le FIC deux, pentesters de l'équipe Audit ont réalisé un challenge IoT dont voici la solution.
Il débute par la consultation de la documentation disponible à cette adresse : https://github.com/hackvens/iot-doc

On y apprend que la première étape est de consulter le script python pour l'allumage du système :

![](./img/Challenge-IoT-FIC-2024_image_1_20240415062411.png)

L'état de la box IoT est le suivant après son branchement :

![](./img/Challenge-IoT-FIC-2024_image_2_20240415062411.png)

Un scan des équipements Bluetooth disponibles permet d’identifier le nom Pwn2Survive :

![](./img/Challenge-IoT-FIC-2024_image_3_20240415062411.png)

Ce nom est présent dans le script de démarrage de la Box :

![](./img/Challenge-IoT-FIC-2024_image_4_20240415062143.png)

Son exécution permet d'allumer la box :
![](./img/Challenge-IoT-FIC-2024_image_4_20240415062411.png)

Qui passe dans un nouvel état :

![](./img/Challenge-IoT-FIC-2024_image_5_20240415062411.png)

Nous pouvons passer à l'étape suivante de la documentation, où nous apprenons qu'il faut générer un tag NFC avec l'UID indiqué :

![](./img/Challenge-IoT-FIC-2024_image_6_20240415062411.png)

Un lecteur est présent et permet de valider cette étape :

![](./img/Challenge-IoT-FIC-2024_image_7_20240415062411.png)

Nous créons un badge avec l'UID attendu à l'aide de la commande suivante :

![](./img/Challenge-IoT-FIC-2024_image_8_20240415062411.png)

Nous vérifions sa valeur :

![](./img/Challenge-IoT-FIC-2024_image_9_20240415062411.png)

La lecture du badge active de nouveaux modules :

![](./img/Challenge-IoT-FIC-2024_image_10_20240415062411.png)

La 3ème étape nécessite l'utilisation de l'interface UART du RaspberryPi Zero :

![](./img/Challenge-IoT-FIC-2024_image_10_20240415062157.png)

Les GPIO nécessaires sont les suivantes :

![](./img/Challenge-IoT-FIC-2024_image_11_20240415062411.png)

Le connecteur gris se trouve sur la terre, le rouge sur le TxD et le cable orange sur le RxD

![](./img/Challenge-IoT-FIC-2024_image_12_20240415062411.png)

Le gris devient le jaune vers le connecteur, le rouge devient le bleu et le cable orange devient le vert.
Mais une erreur de débutant est faite ici :

![](./img/Challenge-IoT-FIC-2024_image_13_20240415062411.png)

Lors de l'utilisation d'un convertisseur UART vers USB, il faut inverser la connectique TxD et RxD.
Ce qui est transmis via l'interface du Raspberry Pi (TxD) doit être réceptionné par le convertisseur (RxD).

Un deuxième point d'attention réside lors de l'utilisation de la commande `screen` afin d'obtenir une connection Série.
Lors de l'utilisation du Bite Rate 115200 par défaut nous n'avions aucune donnée retournée.
Il est ici possible de ne pas définir de valeur, ce qui nous permet d'obtenir le mot de passe du Wi-Fi :

![](./img/Challenge-IoT-FIC-2024_image_16_20240411100230.png)

Une fois connecté, nous obtenons l'adresse IP suivante :

![](./img/Challenge-IoT-FIC-2024_image_15_20240415062046.png)

La dernière étape nécessite de consulter l'application :

![](./img/Challenge-IoT-FIC-2024_image_14_20240415062411.png)

Une page de documentation et une interface d'authentification sont disponibles :

![](./img/Challenge-IoT-FIC-2024_image_15_20240415062411.png)

Chaque potentiomètre permet de modifier les valeurs affichées.
Nous utilisons alors les valeurs présentes dans la documentation :

![](./img/Challenge-IoT-FIC-2024_image_16_20240415062411.png)

Mais nous n'obtenons pas le résultat attendu.
Après l'utilisation du bouton d'allumage nous n'avons pas d'arc en ciel :

![](./img/Challenge-IoT-FIC-2024_image_17_20240415062411.png)

Nous passons donc à l'interface de connexion dont les identifiants sont triviaux (admin/admin) :

![](./img/Challenge-IoT-FIC-2024_image_18_20240415062411.png)

Une fois connecté nous apprenons que les valeurs ont changé :

![](./img/Challenge-IoT-FIC-2024_image_19_20240415062411.png)

Après l'utilisation des valeurs attendues, le challenge est validé par l'affichage d'un arc en ciel :

![](./img/Challenge-IoT-FIC-2024_image_21_20240411100624.png)

Anthony.
