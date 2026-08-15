"use client";

import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import {
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Popover,
  Grid,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import RemoveIcon from "@mui/icons-material/Remove";

// Emoji List
const EMOJIS = ["😀", "😂", "😍", "🙏", "👍", "🔥", "🚀", "💡", "💻", "🎉", "😥", "😡", "💯", "🤔", "🙌", "✨"];

// Mock Data
const MOCK_MESSAGES = [
  { id: 1, text: "Olá! Como posso te ajudar hoje na sua jornada de dev?", sender: "mentor" },
  { id: 2, text: "Estou com uma dúvida sobre como usar o Prisma.", sender: "user" },
  { id: 3, text: "Claro! O Prisma é um ORM excelente. Qual a sua dúvida específica?", sender: "mentor" },
];

export default function GlobalChat() {
  const [windowState, setWindowState] = useState<"CLOSED" | "OPEN" | "MINIMIZED">("CLOSED");
  const [isMockMode, setIsMockMode] = useState(true);
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  
  const [token, setToken] = useState<string | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current && windowState === "OPEN") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, windowState, chatId]);

  // Handle Mode Switch
  useEffect(() => {
    if (isMockMode) {
      setMessages(MOCK_MESSAGES);
      setChatId(null);
    } else {
      setMessages([]);
      setChatId(null);
      handleAutoLoginAndFetchUsers();
    }
  }, [isMockMode]);

  const handleAutoLoginAndFetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "usuarioA@teste.com", password: "123" }),
      });
      
      if (!res.ok) {
        await fetch("http://localhost:3001/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "usuarioA@teste.com", password: "123", role: "NOVATO" }),
        });
        res = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "usuarioA@teste.com", password: "123" }),
        });
      }

      const data = await res.json();
      if (!data.success) throw new Error("Falha no login");
      const jwt = data.data.accessToken;
      setToken(jwt);

      await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "usuarioB@teste.com", password: "123", role: "MENTOR" }),
      }).catch(() => {}); 

      await fetchUsers(jwt);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão no modo real");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (jwt: string) => {
    try {
      const res = await fetch("http://localhost:3001/users", {
        headers: { "Authorization": `Bearer ${jwt}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.data);
      } else {
        throw new Error("Não foi possível carregar os usuários");
      }
    } catch (err) {
      console.error(err);
      setError("Falha ao buscar contatos");
    }
  };

  const startChatWith = async (targetUserId: number) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const chatRes = await fetch("http://localhost:3001/chats/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ targetUserId }),
      });
      
      const chatData = await chatRes.json();
      if (chatData.success) {
        setChatId(chatData.data.id);
        fetchMessages(chatData.data.id, token);
      } else {
        throw new Error("Falha ao iniciar chat");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao conectar");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (cId: number, jwt: string) => {
    try {
      const res = await fetch(`http://localhost:3001/chats/${cId}/messages`, {
        headers: { "Authorization": `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (data.success) {
        const formatted = data.data.map((m: any) => ({
          id: m.id,
          text: m.content,
          sender: m.senderId === 1 ? "user" : "mentor"
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isMockMode) {
      const newMsg = { id: Date.now(), text: inputText, sender: "user" };
      setMessages([...messages, newMsg]);
      setInputText("");
    } else {
      if (!token || !chatId) {
        setError("Não conectado.");
        return;
      }
      
      const tempId = Date.now();
      setMessages((prev) => [...prev, { id: tempId, text: inputText, sender: "user" }]);
      const textToSend = inputText;
      setInputText("");

      try {
        const res = await fetch(`http://localhost:3001/chats/${chatId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ content: textToSend }),
        });
        const data = await res.json();
        if (!data.success) throw new Error("Erro ao enviar");
      } catch (err) {
        setError("Falha ao enviar mensagem");
      }
    }
  };

  return (
    <>
      {windowState === "CLOSED" && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setWindowState("OPEN")}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            backgroundColor: "#D97A64",
            "&:hover": { backgroundColor: "#c26550" },
          }}
        >
          <ChatIcon style={{ color: "#fff" }} />
        </Fab>
      )}

      {windowState === "MINIMIZED" && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 0,
            right: 24,
            width: 250,
            zIndex: 1000,
            backgroundColor: "#2C3943",
            color: "#fff",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
          }}
          onClick={() => setWindowState("OPEN")}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            Chat {isMockMode ? "(Mock)" : (chatId ? "Conversa" : "Contatos")}
          </Typography>
          <Box display="flex">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setWindowState("CLOSED"); }} sx={{ color: "#fff" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      )}

      {windowState === "OPEN" && (
        <Draggable handle=".chat-header" nodeRef={nodeRef}>
          <Paper
            ref={nodeRef}
            elevation={12}
            sx={{
              position: "fixed",
              bottom: 90,
              right: 24,
              width: 400,
              height: 600,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "#fff",
              margin: 0, // Ensure no margin interferes with drag calculation
            }}
          >
            <Box
              className="chat-header"
              sx={{
                backgroundColor: "#2C3943",
                color: "#fff",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "move",
              }}
            >
              <Box display="flex" alignItems="center">
                {!isMockMode && chatId && (
                  <IconButton size="small" onClick={() => setChatId(null)} sx={{ color: "#fff", mr: 1 }} onPointerDown={(e) => e.stopPropagation()}>
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  {isMockMode ? "Chat (Mock)" : (chatId ? "Conversa" : "Contatos")}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={isMockMode}
                      onChange={(e) => setIsMockMode(e.target.checked)}
                      color="warning"
                    />
                  }
                  label={<Typography fontSize={12}>Mock</Typography>}
                  sx={{ m: 0, mr: 1, color: "#fff" }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
                
                <IconButton size="small" onClick={() => setWindowState("MINIMIZED")} sx={{ color: "#fff" }} onPointerDown={(e) => e.stopPropagation()}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => setWindowState("CLOSED")} sx={{ color: "#fff" }} onPointerDown={(e) => e.stopPropagation()}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
              {isLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={24} />
                </Box>
              )}
              
              {error && (
                <Typography color="error" fontSize={12} textAlign="center" p={2}>
                  {error}
                </Typography>
              )}

              {!isMockMode && !chatId && !isLoading && !error && (
                <List sx={{ p: 0 }}>
                  {usersList.length === 0 ? (
                    <Typography color="textSecondary" fontSize={12} textAlign="center" p={2}>
                      Nenhum outro usuário encontrado.
                    </Typography>
                  ) : (
                    usersList.map((user) => (
                      <React.Fragment key={user.id}>
                        <ListItem 
                          onClick={() => startChatWith(user.id)}
                          sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#e0e0e0" } }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#D97A64" }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={user.email} 
                            secondary={user.role?.name || "Usuário"}
                            primaryTypographyProps={{ fontSize: 14 }}
                            secondaryTypographyProps={{ fontSize: 12 }}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                  )}
                </List>
              )}

              {(isMockMode || chatId) && (
                <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                  {!isLoading && messages.length === 0 && !error && (
                    <Typography color="textSecondary" fontSize={12} textAlign="center" mt={2}>
                      Nenhuma mensagem ainda. Inicie a conversa!
                    </Typography>
                  )}
                  {messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                        backgroundColor: msg.sender === "user" ? "#D97A64" : "#E0E0E0",
                        color: msg.sender === "user" ? "#fff" : "#000",
                        p: 1.5,
                        borderRadius: 2,
                        maxWidth: "80%",
                        boxShadow: 1,
                      }}
                    >
                      <Typography fontSize={14}>{msg.text}</Typography>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
              )}
            </Box>

            {(isMockMode || chatId) && (
              <Box
                component="form"
                onSubmit={handleSend}
                sx={{
                  p: 1.5,
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#fff"
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
                  sx={{ color: "#757575" }}
                >
                  <InsertEmoticonIcon />
                </IconButton>
                
                <Popover
                  open={Boolean(emojiAnchorEl)}
                  anchorEl={emojiAnchorEl}
                  onClose={() => setEmojiAnchorEl(null)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 1, width: 220 }}>
                    <Grid container spacing={1}>
                      {EMOJIS.map((emoji) => (
                        <Grid item xs={3} key={emoji} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setInputText((prev) => prev + emoji);
                              setEmojiAnchorEl(null);
                            }}
                          >
                            <Typography fontSize={20}>{emoji}</Typography>
                          </IconButton>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Popover>

                <TextField
                  size="small"
                  fullWidth
                  placeholder="Digite sua mensagem..."
                  variant="outlined"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                  sx={{ input: { color: '#000' } }}
                />
                <IconButton
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  sx={{
                    color: "#D97A64",
                    "&:hover": { color: "#c26550" },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Draggable>
      )}
    </>
  );
}
