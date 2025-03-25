import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { userApi, type User } from "~/api/objects/user";
import { noteApi, type Note } from "~/api/objects/note";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export default function ViewContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setError("No contact ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userResponse = await userApi.get(id);
        
        if ('error' in userResponse) {
          setError(userResponse.error.message);
          setLoading(false);
          return;
        }
        
        setUser(userResponse.data);
        
        // Fetch notes for this user
        if (userResponse.data) {
          const notesResponse = await noteApi.get(null, `user_id = "${id}"`);
          if (!('error' in notesResponse) && notesResponse.data) {
            setNotes(Array.isArray(notesResponse.data) ? notesResponse.data : [notesResponse.data]);
          }
        }
      } catch (err) {
        setError("Failed to load contact information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Contact not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Contact Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Information Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{`${user.first_name} ${user.last_name}`}</CardTitle>
              <CardDescription>{user.role?.name || "Contact"}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone_number}</span>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created on {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            {user.tags_collection && user.tags_collection.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {user.tags_collection.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.user_pipeline_status_collection && user.user_pipeline_status_collection.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Pipeline Status</h3>
                <div className="flex flex-wrap gap-2">
                  {user.user_pipeline_status_collection.map((status, index) => (
                    <Badge key={index} variant="outline">
                      {status.pipeline_status_id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned To Card */}
        {user.user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(user.user.first_name, user.user.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{`${user.user.first_name} ${user.user.last_name}`}</p>
                  {user.user.email && <p className="text-sm text-muted-foreground">{user.user.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notes Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        {notes.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">No notes available for this contact</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {note.created_by_id_user ? 
                          `${note.created_by_id_user.first_name} ${note.created_by_id_user.last_name}` : 
                          "Unknown User"}
                      </CardTitle>
                      <CardDescription>{formatDate(note.created_at)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{note.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}