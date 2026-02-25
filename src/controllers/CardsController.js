class CardsController {
  async search(req, res) {
    const { search } = req.body;
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/named?fuzzy=${search}`,
      );
      const data = await response.json();

      if (data.status === 404) {
        throw new Error("Error ao buscar dados na API Externa");
      }

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CardsController();
