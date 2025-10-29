import Slider from "react-slick";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../components/CostumeCard";

export default function FeaturedCostumes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
 
  //Kostiumams yra apribojimas iki 6 kostiumų
  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/api/costumes");
        const featured = data.slice(0, 8);
        setItems(featured);
      } catch (err) {
        console.error("Nepavyko gauti rekomenduojamų kostiumų:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Kraunama...</p>;
  if (!items.length) return <p>Nėra rekomenduojamų kostiumų.</p>;

  //react-slick slider'io nustatymai
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,          // įjungia automatinį slinkimą
    autoplaySpeed: 3000,     // keičia skaidrę kas 3 sekundes
    pauseOnHover: true,      // sustoja, kai užvedama pele
    arrows: true, 
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section style={{ padding: "40px 0" }}>
      <Slider {...settings}>
        {items.map((it) => (
          <div key={it.id}>
            <Card costume={it} compact />
          </div>
        ))}
      </Slider>

      {/* Mygtukas "Pamatyti visus kostiumus" */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Link
          to="/costumes"
          className="btn btn--primary"
          style={{ padding: "12px 24px", fontSize: 16}}
        >
          Pamatyti visus kostiumus
        </Link>
      </div>
    </section>
  );
}
