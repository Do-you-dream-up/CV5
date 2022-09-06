export default function Personne(prenom, nom, age, genre, interets) {
  this.nom_complet = {
    prenom,
    nom,
  };
  this.age = age;
  this.genre = genre;
  this.interets = interets;
}

Personne.prototype.saluer = function () {
  console.log('Salut! Je suis une personne ' + this.nom_complet.prenom + '.');
};
