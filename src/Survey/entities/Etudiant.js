import Personne from './Personne';

export default function Etudiant(annee, ...persone) {
  Personne.call(this, ...persone);
  this.annee = annee;
}

Etudiant.prototype = Object.create(Personne.prototype);
Etudiant.prototype.constructor = Etudiant;

Etudiant.prototype.saluer = function () {
  console.log('salut je suis un étudiant. je suis ' + this.nom_complet.prenom);
  console.log('étudiant, je suis en année ' + this.annee);
};
