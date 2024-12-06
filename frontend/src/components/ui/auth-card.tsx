import { Card, CardContent, CardHeader } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Link } from "react-router-dom";

const LOGO_URL = "https://apirequest.app/api/public/logo?site_address=launchpad.surge.global";

interface AuthCardProps {
  title?: string;
  isLoading: boolean;
  error?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  fields: {
    name: string;
    type: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    error?: string;
  }[];
  submitText: string;
  alternateText: string;
  alternateLinkText: string;
  alternateLinkTo: string;
}

export function AuthCard({
  title,
  isLoading,
  error,
  onSubmit,
  fields,
  submitText,
  alternateText,
  alternateLinkText,
  alternateLinkTo,
}: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-4 bg-[#fafafa]">
      <div className="w-full max-w-[350px] space-y-4">
        <Card className="border rounded-[1px] bg-white px-10 py-8">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="flex justify-center mb-8">
              <img 
                src={LOGO_URL}
                alt="Surge Social" 
                className="h-12"
              />
            </div>
            {title && (
              <h2 className="text-xl font-semibold text-[#222222]">{title}</h2>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-[#de4548] bg-red-50 border border-red-200 rounded-[1px] text-center">
                  {error}
                </div>
              )}
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={`bg-[#fafafa] text-sm px-2 py-[9px] rounded-[1px] w-full ${
                      field.error ? "border-[#de4548]" : "border-[#dddddd]"
                    }`}
                    disabled={isLoading}
                    aria-invalid={!!field.error}
                    aria-describedby={field.error ? `${field.name}-error` : undefined}
                  />
                  {field.error && (
                    <p className="text-xs text-[#de4548]" id={`${field.name}-error`}>
                      {field.error}
                    </p>
                  )}
                </div>
              ))}
              <Button 
                type="submit" 
                className="w-full bg-[#de4548] hover:bg-[#c13c3f] text-white text-sm font-semibold py-[7px] rounded-[4px]"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : submitText}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border rounded-[1px] bg-white py-4">
          <CardContent className="text-center text-sm">
            <p className="text-[#555555]">
              {alternateText}{" "}
              <Link 
                to={alternateLinkTo} 
                className="text-[#de4548] font-semibold hover:text-[#c13c3f]"
                tabIndex={0}
              >
                {alternateLinkText}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-12 text-center text-xs text-[#999999]">
        <div className="max-w-lg mx-auto space-y-4">
          <nav className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </nav>
          <p>© 2024 Surge Social</p>
        </div>
      </footer>
    </div>
  );
}
