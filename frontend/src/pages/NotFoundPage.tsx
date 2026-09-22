import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft, Phone } from "lucide-react";
import { Container } from "../components/common/Container";
import { Button } from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 sm:py-32">
      <Container size="md">
        <div className="text-center space-y-6 bg-white p-8 sm:p-14 rounded-2xl border border-slate-200 shadow-industrial">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Error 404 — Not Found</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Equipment Resource Not Found
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page or catalog resource you requested does not exist or has been relocated within the GenesisConnect system.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Return to Home
              </Button>
            </Link>

            <Link to="/products">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Browse Equipment Catalog
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                variant="ghost"
                size="md"
                leftIcon={<Phone className="w-4 h-4" />}
              >
                Contact Technical Support
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
