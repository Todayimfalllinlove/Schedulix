import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ user, profile, setProfile }) => {
    const [editableProfile, setEditableProfile] = useState(profile);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [tempFullName, setTempFullName] = useState(''); // temporary state for fullName
    const [subjects, setSubjects] = useState([]);

    React.useEffect(() => {
        setTempFullName(profile.full_name);
        setEditableProfile(profile);
    }, [profile]);

    // ดึง subject ทั้งหมดของ user
    useEffect(() => {
        if (user?.id) {
            supabase
                .from('subjects')
                .select('*')
                .eq('user_id', user.id)
                .then(({ data }) => setSubjects(data || []));
        }
    }, [user?.id]);

    const handleProfileChange = (field, value) => {
        setEditableProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        if (!user || !user.id) {
            alert('User not authenticated.')
            return
        }
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: editableProfile.full_name,
                    email: editableProfile.email,
                    study_goal: editableProfile.study_goal,
                    preferred_time: editableProfile.preferred_time,
                    avatar_url: editableProfile.avatar_url,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });
            if (error) {
                throw error;
            }
            setProfile(editableProfile);
            alert('Profile updated!');
            setIsEditing(false);

        } catch (error) {
            console.error('Error saving profile:', error.message)
            alert(`Error saving profile: ${error.message}`)
        } finally {
            setSaving(false);
        }
    }

    const handleAvatarUpload = async (event) => {
        if (!user || !user.id) {
            alert('User not authenticated for avatar upload.');
            return;
        }

        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `avatar.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { 
                    cacheControl: '3600',
                    upsert: true 
                });

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filePath)

            const publicUrl = publicUrlData?.publicUrl

            if (!publicUrl)
                throw new Error('Could not get public URL for the uploaded file.')

            // **Important:** Add Cache Buster for Browser can reload image every time.
            const finalAvatarUrl = `${publicUrl}?t=${Date.now()}`;

            console.log('User ID before upsert:', user.id);

            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: finalAvatarUrl,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' })

            if (updateError) {

                const finalAvatarUrl = `${publicUrl}?t=${Date.now()}`;

                console.log('User ID before upsert:', user.id); 
                const { error: updateError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        avatar_url: finalAvatarUrl,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'id' })

                throw updateError
            }

            setProfile(prevProfile => ({
                ...prevProfile,
                avatar_url: finalAvatarUrl
            }))
            setEditableProfile(prev => ({
                ...prev,
                avatar_url: finalAvatarUrl
            }))

            alert('Avatar updated successfully!');

        } catch (error) {
            console.error('Error uploading avatar:', error.message)
            toast.error('Error uploading avatar', error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <Card className="p-4 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="px-0 pb-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 gap-y-4 mb-8">
                    <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700 shadow-lg">
                        <AvatarImage className="object-cover w-full h-full" src={editableProfile?.avatar_url || "/placeholder.svg" } />
                        <AvatarFallback className="text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {editableProfile?.full_name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center sm:items-start w-full">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">{editableProfile?.full_name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg text-center sm:text-left">{editableProfile?.email}</p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-white/20 dark:hover:bg-gray-800/20 w-full sm:w-auto"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Change Photo"}
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleAvatarUpload}
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    setTimeout(() => navigate("/auth"), 100);
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 sm:px-0">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                        <Input
                            id="name"
                            value={editableProfile?.full_name || ""}
                            onChange={(e) => handleProfileChange('full_name', e.target.value)}
                            className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={editableProfile?.email || ""}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="studyGoal" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weekly Study Goal</Label>
                        <Input
                            id="studyGoal"
                            value={editableProfile?.study_goal || ""}
                            onChange={(e) => handleProfileChange('study_goal', e.target.value)}
                            className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="preferredTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Study Time</Label>
                        <Input
                            id="preferredTime"
                            value={editableProfile?.preferred_time || ""}
                            onChange={(e) => handleProfileChange('preferred_time', e.target.value)}
                            className="h-12 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end mt-8 space-y-2 sm:space-y-0 sm:space-x-3">
                    <Button
                        variant="outline"
                        className="hover:bg-white/20 dark:hover:bg-gray-800/20 w-full sm:w-auto"
                        onClick={() => setEditableProfile(profile)}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                        onClick={handleSaveProfile}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserProfile