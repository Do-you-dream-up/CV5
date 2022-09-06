import Personne from './Personne';

export default function Professeur(prenom, nom, age, genre, interets, matiere) {
  Personne.call(this, prenom, nom, age, genre, interets);

  this.matiere = matiere;
}

Professeur.prototype = Object.create(Personne.prototype);
Professeur.prototype.constructor = Professeur;

Professeur.prototype.saluer = function () {
  var prefix;

  if (this.genre === 'mâle' || this.genre === 'Mâle' || this.genre === 'm' || this.genre === 'M') {
    prefix = 'M.';
  } else if (this.genre === 'femelle' || this.genre === 'Femelle' || this.genre === 'f' || this.genre === 'F') {
    prefix = 'Mme';
  } else {
    prefix = '';
  }

  console.log('Bonjour. Mon nom est ' + prefix + ' ' + this.nom_complet.nom + ", et j'enseigne " + this.matiere + '.');
};
