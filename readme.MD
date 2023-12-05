# Projet Annuel de 5eme année filière IABD Le groupe est composé de Hedi BOUFADEN, Kamel MALKI et Ilès BENKOUSSA

# Présentation du projet

Projet permettant la gestion de salles de travail dites flex-office pour des entreprises en tant réel. L'utilisateur d’une entreprise voit les salles de son entreprise avec leur taux de remplissage changer en temps réel. La partie temps réel est gérée avec une Cloud function qui écoute un topic pubsub pour modifier l’état de la salle dans Firebase. Firebase renvoie par la suite la liste des salles au frontend avec les mises à jour, sans avoir à rafraîchir le frontend. 
Le backend permet la partie CRUD de l’application. Les salles et utilisateurs étaient stockés sur Firebase. Également la présence d’un job streaming Dataflow permettant l’écoute des messages d’entrée et de sortie des personnes, et les insérant en streaming dans une table BigQuery. Cette table stocke toutes les entrées et sorties des personnes dans les salles, ce qui aurait permis de faire des analyses par la suite. 

Kamel : J’ai travaillé sur le backend, ainsi que la partie GCP, dataflow, cloud function.

Stack technique :
- Front end ReactJS
- Backend SpringBoot
- Cloud GCP
- Base de données :
  - Firebase
  - Datawarehouse BigQuery
- Google Cloud Function
- Google Dataflow streaming
- Terraform


Vous trouverez dans ce dossier les codes sources (sans les fichiers de build) des différentes briques de notre projet.
Elles ne seront pas executable puisque les services GCP seront coupés (donc pas de BDD ni de service pubsub, dataflow, cloud function ou de compte de service permettant la communication avec les services..).
