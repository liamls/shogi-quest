const pieceDescriptions = {
    R: {
        name: "Roi",
        description: "Se déplace d'une case dans n'importe quelle direction.",
      },
      T: {
        name: "Tour",
        description: "Se déplace verticalement ou horizontalement sans limite.",
      },
      P: {
        name: "Pion",
        description: "Se déplace d'une case en avant et capture en diagonale.",
      },
      L: {
        name: "Lance",
        description: "Se déplace comme une Tour, mais ne peut pas reculer.",
      },
      C: {
        name: "Cavalier",
        description: "Bondit vers l'avant comme un Cavalier d'échecs.",
      },
      A: {
        name: "Général d'Argent",
        description: "Se déplace d'un pas vers l'avant ou en diagonale.",
      },
      O: {
        name: "Général d'Or",
        description:
          "Se déplace d'un pas dans toutes les directions sauf en diagonale.",
      },
}

export default pieceDescriptions;